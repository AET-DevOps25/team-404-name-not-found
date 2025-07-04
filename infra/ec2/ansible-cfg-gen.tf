resource "local_file" "hosts_cfg" {
  content = templatefile("${path.module}/inventory.ini.tpl", {
    ip = aws_instance.debian.public_ip
  })
  filename        = "hosts.ini"
  file_permission = "0644"
}
