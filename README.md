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

These are the events sent to the plugins while executing an entity request.
All events use the IPluginEvent interface, but fields are populated during
the process. In all step I mark the fields which should be changed. Note that
event.errors and event.context is always available for read/write

entity.preroute
---------------

- field: request
- gets the request, and can modify it (eg remove used path part)
- only global plugins invoked
- set language per header or url
- set authentication data per header or cookie or whatever

entity.route
------------

- field: target
- chose an action to be taken
- only global plugins invoked
- handledBy should be set here or at most postroute. Any plugin canoverwrite
handledBy if it can handle better the current request.
- $rest plugin should take care of most cases

entity.postroute
-----------------

- field: target
- target.entityConfig is now available
- finalize route and param fetching
- after this step, the route matching should be final, except for special cases 
when the matched route fails or has to be changed based on loaded data. 
- eg. the versioning plugin mentioned before should add constraints in this step
-beginning with this step, entity plugins are invoked too

entity.before
-------------

- field: oldValue$
- after a request is routed, set specific params for execution, or prepare data
- load current version into context.currentData. This will be needed in most
cases, for validation, or GET can return it directly later
- eg. a special case would be a PUT to a resource with ID, which should be a 
replace. However, if it does not exist, it becomes a create in the next step.
- eg. a get or patch to a non existing ID can be found here and should rather 
go to a 404
// - eg set db retrieve params based on language
// - eg set timestamps for updates or creates

entity.validate
---------------

- field: errors only
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

- field: target.result
- execute an action
- event.value contains target state, event.oldValue contains current state

entity.after
------------

- field: target.result
- do additional processing, eg. an aggregated sum field in another object has 
to be updated, or update search index
- build data for response
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

#example usecase
url: /city/42
method: patch

### entity.preroute
- auth plugin sets user data from jwt in header or cookie, and sets in context

### entity.route
- $rest eats up remaining event.target.urlParts and sets ~.entity, ~.entityId, and
also pushes selector by id into ~.constraints
- $rest sets incoming PATCH data in ~.data$ 
- $rest also sets ~.method and ~.handledBy 

### entity.postroute
- 
- as no more URL parts available, no further routing
- auth plugin could check already here if user is authorized, skipping entity.before

### entity.before
- $rest loads current document into event.oldValue$, using params from 
event.target.constraints
- $rest plugin calculates resulting object and sets it in event.target.result
- auth plugin sets updatedBy field in both event.target.data and event.target.result
- $timestamp plugin sets updatedAt field in both event.target.data and event.target.result 

### entity.validate
- auth plugin checks if user is authorized to run the PATCH against the given entity
- $rest plugin validates resulting object against entity schema

### entity.execute
- $rest plugin sends update with data in event.target.data

### entity.after
- $rest plugin reads back object (or not, depending on config)

### entity.finish
- $shaper plugin trims returned data in target.result

#example usecase
url: /city/42/en
method: get

### entity.preroute
nothing

### entity.route
- $rest plugin recognizes entity name and id, same as previous

### entity.postroute
- local entity $translation plugin recognizes 'en' language tag, and clears it 
from pathParts. Also sets language in context. (now it's doing it here because 
this translation is now a shaping of a given entity, not another entity. This
method is used when config is set to multiple fields per language method)

### entity.before
- $rest loads current document into event.oldValue$, using params from 
event.target.constraints

### entity.validate
- nothing happens, it's a get request without auth or similar to be checked
- only point of failure is an invalid entity name and/or id, but that should
have had throuwn in entity.before

### entity.execute
- $rest copies oldData to target.result

### entity.finish
- $translation plugin filters translated fields to given language and maps 
translations one level down
 
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

180405 03:22 first successful GET /rest/test/ answer

@TODO
=====

$restPlugin
	numeric _id (has to be parseFloat'ed before sending to DB)
