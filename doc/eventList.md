events
======

Events not implemented are marked by #
Events incompletely implemented marked by *

server level
------------
server.ready 
	emitted by server deps to signal server when they're ready, eg
	{eventName: 'server.ready', data: 'EntityManager'}
	emitted by server when all deps ready, triggers server itself to start listening
	{eventName: 'server.ready', data: 'Server'} 
server.init
	emitted by: any, triggers a server dep to reload data
	{eventName: 'server.init', data: 'EntityManager'}
	emitted by: any, triggers all server deps and server to reload data
	{eventName: 'server.init', data: 'Server'}  

entity level
------------
entity.routing
# entity.validate
# entity.create
# entity.created
# entity.update
# entity.updated
# entity.change
# entity.changed
# entity.replace
# entity.replaced
# entity.delete
# entity.deleted

schema level
------------
# schema.compile
