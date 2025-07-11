PLAYBOOK ?= playbook.yml

ssh:
	chmod 400 priv.pem
	ssh -i priv.pem admin@$(shell terraform output -raw ip)

init:
	terraform init -input=false

deploy: init
	terraform apply -input=false --auto-approve

ansible:
	ansible-playbook -i hosts.ini $(PLAYBOOK)

teardown: init
	terraform destroy -input=false --auto-approve
