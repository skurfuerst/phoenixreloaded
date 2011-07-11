PHOENIX RELOADED PROTOTYPE
==========================

How to Clone (write)
--------------------

git clone --recursive git@github.com:skurfuerst/phoenixreloaded.git

How to Clone (read-only)
------------------------

git clone --recursive git://github.com/skurfuerst/phoenixreloaded.git


How to update
-------------

After updating the main project, also update aloha with the following commands:

cd js/libs/aloha
git checkout dev-blocks
git pull
cd src/plugins/common
git checkout master
git pull
cd ../../../../../../

Guides
------

For development guides, we (for now) use the "guides" gem:

> sudo gem install guides

Then, follow these steps to render a guide:

> cd doc
> guides preview
# now open your browser at http://localhost:9292


Structure
---------

css/style.css <-- Content Module stylesheet
website <-- unmodified stuff from the original website (styles+images); DO NOT TOUCH

index.html <-- dummy page

js/alohaplugins/phoenixintegration/ <-- Aloha integration plugin

js/lib <-- dependencies. DO NOT TOUCH

ToDo List
---------

* DONE: *T1* Dependency Management with RequireJS (investigate how to load Aloha *and* custom stuff using RequireJS, i.e. how to use RequireJS twice on website)
* T2 Fix SproutCore right bar issue, and remove quickfix at sproutcore.js:line 1565
* T3 Save Aloha-Content back to model (needs B1)
* *T4* Connect to Phoenix Backend
* T5 create one generic editable block
* *T6* document architecture and event flow
* T7 implement adding of content
* T8 implement editing of page properties
* T9 implement block container

Aloha
* A1 include src/util/base.js with RequireJS -- check how this should be done.
* A2 upgrade jQuery version, or do some RequireJS magic
* A3 see if format plugin works still
* A4 make ExtJS styles only apply partially

Aloha Blocks
* B1 When we re-render a block, we create *NEW* editables *WITHOUT* properly destroying
     the old ones. !!! We should somehow change this maybe, such that we do not need to
     re-build the editables all the time as this is quite costly and could result in strange user behavior.
* B2 rename element to $element in block.js
* B3 refactor Templateable Blocks into a mixin


Links to learn about SproutCore 2
---------------------------------

* http://guides.sproutcore20.com/
* http://docs.sproutcore20.com/
* Read the source at https://github.com/skurfuerst/phoenixreloaded/blob/master/js/libs/sproutcore.js - very well readable in general, searching stuff if quite easy,
  quite some good doc comments