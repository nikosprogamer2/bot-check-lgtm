FROM node:14.16.1-slim

ENV USER=AL

# install python and make
RUN apt-get update && \
	apt-get install -y python3 build-essential && \
	apt-get purge -y --auto-remove
	
# create user
RUN groupadd -r ${USER} && \
	useradd --create-home --home /home/AL -r -g ${USER} ${USER}
	
# set up volume and user
USER ${USER}
WORKDIR /home/AL

COPY --chown=${USER}:${USER} package*.json ./
RUN npm install
VOLUME [ "/home/AL" ]

COPY --chown=${USER}:${USER} . .

ENTRYPOINT [ "node", "shardingManager.js" ]