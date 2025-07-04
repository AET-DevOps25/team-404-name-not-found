terraform {
  required_version = ">= 1.12"
}

provider "aws" {
  region = var.aws_region
}

provider "local" {

}

provider "random" {

}

data "aws_ami" "debian" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "name"
    values = ["debian-12-amd64*"]
  }
}


resource "aws_security_group" "ssh" {
  name        = "allow-ssh-${random_pet.name.id}"
  description = "Allow SSH inbound traffic"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "random_pet" "name" {
  length    = 2
  separator = "-"
}

resource "aws_instance" "debian" {
  ami           = data.aws_ami.debian.id
  instance_type = var.instance_type

  # the key and sg are automatically generated when starting a lab
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.ssh.id]
  associate_public_ip_address = true

  tags = {
    Name = "team-404-name-not-found-debian-${random_pet.name.id}"
  }
}
