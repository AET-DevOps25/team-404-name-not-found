variable "aws_region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t3.large"
}

variable "key_name" {
  default = "vockey"
  type    = string
}
