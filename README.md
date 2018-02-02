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

* server plugins are plugins which actuate in all scenario. These are defined
	in the server config.
* entity plugins are those assigned to an entity schema and are called only
	for operations on the given plugin
	
plugin config
-------------

Plugin configs are defined by their schema. These schema live in the ua_plugin
collection. The actual configuration is saved into the server or the entity
config, respectively.

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
