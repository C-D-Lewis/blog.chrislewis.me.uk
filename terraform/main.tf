module "main" {
  source          = "./infrastructure"
  region          = var.region
  project_name    = var.project_name
  vpc_id          = var.vpc_id
  zone_id         = var.zone_id
  domain_name     = var.domain_name
  certificate_arn = var.certificate_arn
}

provider "aws" {
  region = var.region
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.60"
    }
  }

  backend "s3" {
    bucket = "chrislewis.me.uk-tfstate"
    key    = "blog"
    region = "us-east-1"
  }
}
