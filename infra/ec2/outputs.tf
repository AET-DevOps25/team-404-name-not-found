output "ip" {
  value = aws_instance.debian.public_ip
}

output "dns" {
  value = aws_instance.debian.public_dns
}
