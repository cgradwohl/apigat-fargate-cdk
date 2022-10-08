import { CfnOutput, CfnResource, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { CfnIntegration, CfnRoute, CfnApi } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import path = require("path");

export class MainCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, "MyVpc", {
      maxAzs: 3,
    });

    const cluster = new Cluster(this, "MyCluster", {
      vpc: vpc,
    });

    const fargate = new ApplicationLoadBalancedFargateService(
      this,
      "MyFargateService",
      {
        assignPublicIp: false,
        cluster: cluster,
        cpu: 512,
        desiredCount: 1,
        memoryLimitMiB: 2048,
        publicLoadBalancer: false,
        taskImageOptions: {
          image: ContainerImage.fromAsset(path.join(__dirname, "../src/")),
        },
      }
    );

    const httpVpcLink = new CfnResource(this, "HttpVpcLink", {
      type: "AWS::ApiGatewayV2::VpcLink",
      properties: {
        Name: "V2 VPC Link",
        SubnetIds: vpc.privateSubnets.map((m) => m.subnetId),
      },
    });

    /**
     * Create a new API Gateway HTTP API endpoint.
     * @resource AWS::ApiGatewayV2::Api
     */
    const api = new HttpApi(this, "HttpApiGateway", {
      apiName: "ApigwFargate",
      description:
        "Integration between apigw and Application Load-Balanced Fargate Service",
    });

    console.log("api.ref ::", api.httpApiId);
    console.log("api.erl ::", api.url);

    /**
     * Create a new `AWS::ApiGatewayV2::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    const cfnApi = new CfnApi(this, "MyCfnApi", {
      description: "description",
      name: "name",
    });

    console.log("cfnApi.ref", cfnApi.ref);
    console.log("cfnApi.attrApiEndpoint", cfnApi.attrApiEndpoint);

    const integration = new CfnIntegration(this, "HttpApiGatewayIntegration", {
      apiId: api.httpApiId,
      // apiId: cfnApi.ref,
      connectionId: httpVpcLink.ref,
      connectionType: "VPC_LINK",
      description: "API Integration with AWS Fargate Service",
      integrationMethod: "GET", // for GET and POST, use ANY
      integrationType: "HTTP_PROXY",
      integrationUri: fargate.listener.listenerArn,
      payloadFormatVersion: "1.0", // supported values for Lambda proxy integrations are 1.0 and 2.0. For all other integrations, 1.0 is the only supported value
    });

    new CfnRoute(this, "Route", {
      apiId: api.httpApiId,
      // apiId: cfnApi.ref,
      routeKey: "GET /", // for something more general use 'ANY /{proxy+}'
      target: `integrations/${integration.ref}`,
    });

    new CfnOutput(this, "APIGatewayUrl", {
      description: "API Gateway URL to access the GET endpoint",
      value: api.url!,
      // value: cfnApi.attrApiEndpoint!,
    });
  }
}
