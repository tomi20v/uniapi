what this is
============

UniApi is a plugin based, configurable rest api service.

It is also an attempt to solve tipical problems eg. synchronized startup,
plugin architecture, etc. using RFP (reactive functional programming). This
also means some solutions are inefficient just to be RFP.

A configuration utility using angular2 is bundled and optionally served too.

data storage
============

Currently only mongodb is supported.

internal collections
--------------------

* ua_entity - stores actual config of entities
* ua_plugin - plugin config shemas
* ua_schema - schema

entity concept
==============

uniapi basically is a REST datastore microservice for entities. Entities are
configured by having a schema (data) and plugins (data and behaviour). 

plugins
=======

Plugins are middleware just like express middleware. The assigned plugins are
called in chain for a variety of events, with event and context data. The
plugins decide if they process the current event or not, and how. Eg. when
compiling an entity's schema, the $timestamp plugin adds its field to it.
When updating an entity, the same plugin will update the relevant fields.

Currently plugins have to be registered manually.

plugin levels
-------------

Plugins are assigned by defining their configuration at the proper place. 2 
levels are considered:

* server (global) plugins are plugins which actuate in all scenario. These are defined
	in the server config.
* entity plugins are those assigned to an entity schema and are called only
	for operations on the given plugin
	
plugin config
-------------

Plugin configs are defined by their schema. These schema live in the ua_plugin
collection. The actual configuration is saved into the server or the entity
config, respectively.

implementing plugins
--------------------

- Create interface for config. Optional, but is recommended.
- Create initDb class. Extend AInitDb and define configSchema. It is required 
even if a plugin doesn't need configuration, just to define pluginId, enabled 
and description properties.
- If the plugin should be activated automatically, define defaultXxxConfigs 
variables. Set them empty array [] if not needed. 
- (The configSchema and default definitions are registered automatically.)
- Create plugin class. Extend APlugin and implement
- Register plugin and initdb in BootPluginsLocal.ts
- Run **npm run initdb** to save config and apply changes if any

request lifecycle events
========================

These are the events sent to the plugins while executing an entity request:

entity.preroute
---------------
*IPluginEvent<IEntityRequest,null>*

- set language per header or url
- set authentication data per header or cookie or whatever

entity.route
------------
*IPluginEvent<IEntityTarget, IEntityRequest>*

- define an action to be taken
- mostly $rest plugin should take care of

entity.before
-------------
*IPluginEvent<IEntityTarget, IEntityTarget>*

- after a request is routed, set specific params for execution, or prepare data
- if needed (eg update), will load current version into context.currentData for 
validation
- eg set db retrieve params based on language
- eg set timestamps for updates or creates

entity.validate
---------------
*IPluginEvent<IEntityTarget, IEntityTarget>*

- validate request before executing
- confirm execution: any plugin that can generate output by current target in 
value must event.value.isHandled = true
- event.value contains target state, event.oldValue contains current state
- push any errors into event.errors
- note that errors could be pusher to event.errors in any handler
- any errors in event.errors breaks event lifecycle and ends up in error 
handler (@todo, currently possible errors are thrown after validation only ) 

entity.execute
---------------
*IPluginEvent<IEntityTarget, IEntityTarget>*

- execute an action
- event.value contains target state, event.oldValue contains current state

entity.after
------------
*IPluginEvent<IEntityTarget, IEntityTarget>*

- do additional processing
- event.value contains response data
- eg. join objects referenced by a field
- eg. shape data (return only specific fields)

entity.finish
-------------
- change response based on specific requirements
- eg. translate fields or fill templates
- eg. write log of what's been done

entity.error
------------
- end up here after any lifecycle event completed with errors
- prepare error response
- will be called only in case of errors
- $rest plugin is to prepare the error response normally

entity.send
-----------
- send the response from assembled data
- $rest plugin will send response in any case
 
transactions
============

Planned.

server config
=================

The servers config is currently defined in the defaultConfig.json file.
Server config cannot be changed on the fly, or by API.

configuration API
=================

A predefined API is available for configuring the entities. This includes:
* entity editor with builtin plugin configurator and shema selector
* schema CRUD
* service to get an entity's compiled schema (@todo)

example URLs

http://localhost:4200/config/entity/
http://localhost:4200/config/entity/$address

configuration GUI client
========================

If enabled and installed, an angular based GUI is available at

http://localhost:4200/config/client/

entity API
==========

Entity api is configurable through the $rest plugin. This plugin will take care
of the basic REST operations. The operations can be freely mapped and also 
disabled, eg. DELETE to collection and POST to item urls are disabled by default.
Eg. POST to item url could be mapped to update and PATCH disabled if required.

example URLs

http://localhost:4200/myEntity/ (get, put, post)
http://localhost:4200/myEntity/12345 (get, put, patch, delete)

