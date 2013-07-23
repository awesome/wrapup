"use strict";

var prime = require('prime')
var path = require('path')
var util = require('./util')

var uid = 0

var Module = prime({

    constructor: function(full, uid){
        this.full = full
        this.uid = uid
        this.deps = []
        this.requires = []
        this.ast = null
        this.src = ""
        this.namespace = ""
        this.ready = false
        this.err = false

        this.moduleIDs = {}
    },

    getModuleID: function(_path){
        if (this.moduleIDs[_path]) return this.moduleIDs[_path]

        var file = util.relativeID(_path, this.full)
        // rename modules if the files are out of scope
        if (file.slice(0, 2) == '..'){
            file = '__oos/' + (uid++) + '-' + path.basename(this.full)
        }

        if (path.extname(file) == '.js') file = file.slice(0, -3)
        file = file.slice(0, 2) == './' ? file.slice(2) : file
        this.moduleIDs[_path] = file
        return file
    },

    getModuleFile: function(_path){
        return this.getModuleID(_path) + '.js'
    },

    getRelativeDeps: function(_path){
        var deps = []
        if (!this.err){
            this.deps.forEach(function(dep){
                if (dep) deps.push(dep.getModuleID(_path))
            })
        }
        return deps
    }

})

module.exports = Module