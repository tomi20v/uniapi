events
======

Events not implemented are marked by #
Events incompletely implemented marked by *

server level: ServerEventInterface
----------------------------------
Server level events are used to control the server lifecycle. They are not 
sent to plugins unless noted otherwise.

server.ready 
	emitted by server when it starts to listen
	{eventName: 'server.ready', data: 'Server'} 
server.init
	emitted by: any, triggers a server dep to reload data
	{eventName: 'server.init', data: 'EntityManager'}
	emitted by: any, triggers all server deps and server to reload data
	{eventName: 'server.init', data: 'Server'}
#server.initdb
	emitted manually by initdb script, each plugin can register itself
		as global plugin. This event is emitted to all registered plugins
	{eventName: 'server.initdb', data: <AppConfig>appConfig}


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
