#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { MainCdkStack } from "../lib/main";

const app = new cdk.App();
new MainCdkStack(app, "MainCdkStack", {});
