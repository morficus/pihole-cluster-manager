#!/bin/bash

username=$1
host=$2
sshkey=$3
url_list=$4

ssh -i $sshkey $username@$host "pihole whitelist --nuke"
ssh -i $sshkey $username@$host "pihole whitelist $url_list"
