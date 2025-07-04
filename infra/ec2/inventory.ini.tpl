[workers]
vm ansible_host=${ip} ansible_user=admin

[all:vars]
ansible_ssh_common_args='-o StrictHostKeyChecking=no'