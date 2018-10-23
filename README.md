# pihole-cluster-manager
For managing multiple [PiHole](https://pi-hole.net/) instances and keeping them all in-sync

*** THIS IS CURRENTLY UNDER ACTIVE DEVELOPMENT AND IS NOT CONSIDERED STABLE OR SUITABLE FOR PRODUCTION USE ***

## Running the cluster manager
You don't HAVE to run this on a Raspberry Pi, but there is no reason you can't.   
In order to run this you will need to have [Node.JS](https://nodejs.org/en/) installed.  
At the moment the only way to run this project is by manually grabbing it off GitHub by cloning with git or [downloading the zip](https://github.com/morficus/pihole-cluster-manager/archive/master.zip).  
Once you have the project on your machine, just run `npm install` to grab all the dependencies then `node index.js` to start the application and you should be off to the races.  

Once things are ready for a stable release I'll try to make installation a bit easier.

## Installing Node on a Raspberry Pi
(these steps are optional, the only apply if you want ot run the Cluster Manager on a Pi)
These instruction assume a few things:
* You already have [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) installed on your device.
* You are using an ARMv7 or ARMv8 chip (such as the Pi 2 or Pi 3)

Once the above pre-conditions are true, follow these steps:
1. While logged in to the Pi (either SSH or some other way), run this command to update the Debian apt package repository to include the NodeSource packages: `curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`
    * It's always good to know what a script is doing before running it. If you are heavy on the security side you can open `https://deb.nodesource.com/setup_10.x` in a browser and just read through it.
    * TL;DR: it does some checking to determine the Linux distribution you are running and tells the Debian package system to add the NodeSource package repository as a trusted source for obtaining Debian packages
    * This script will install the "Current" release of Node. If you rather install the "LTS" version... then change `setup_10.x` to `setup_8.x` in the above command
2. Install Node.js using good old apt: `sudo apt install -y nodejs`
3. Once the above is done, you can confirm things are installed by running `node -v`
    * If everything worked you should see some output like this: `v10.11.0`


## The API
The core of this project is web API along with a series of scripts is what makes it all possible. Currently all APIs are documented using [Postman](https://www.getpostman.com/), so you can import the collection and environment that are in the [postman directory](./postman) and explore the API to your hearts content.  
I use Postman as part of my development workflow, so you can be sure that everything in that collection is upt-to-date. I may generate some API docs or something in the future.

## Adding nodes to the cluster
1- Add the node info to the cluster manager (`POST /api/nodes`)  
2- Get the public key info for each node (`GET /api/nodes` to get the node ID, then the `GET /api/nodes/:id/publickey` to get the key)  
3- Copy that key to each node and place it in the `.ssh/authorized_keys` file  
4- Test communication with each node (`GET /api/nodes/:id/version`)    

## Developing

### Setting up a test DB
This project uses [sqlite](https://www.sqlite.org/) as its datastore. Since it is an self-contained, embedded databases... there is no additional things to set up.  
The DB file will be automatically created the first time you run the application (the default location is `db/pihole-cluster.db`)

If you want to visualize the DB schema you can use [MySQL Workbench](https://mysqlworkbench.org) to open the model found at `db/model.mwb` (but this visual could fall out of date)
