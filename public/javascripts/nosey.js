var nosey = (function () {
    function iHaveTemplate(self) {
        self.template = function (item) {
            return item ? item.template() : self.type() + '-' + self.mode();
        };
    }

    function capitalize(input) {
        if (!input) {}
        return input[0].toUpperCase() + input.slice(1);
    }

    function initHelper(self, data, simple, mapping) {
        var prop, sprop;
        if (simple) {
            for (prop in simple) {
                if (simple.hasOwnProperty(prop)) {
                    data[prop] = data[prop] || simple[prop];
                }
            }
        }
        mapping = mapping || {};
        if (simple) {
            for (prop in simple) {
                if (simple.hasOwnProperty(prop) && $.isArray(simple[prop])) {
                    sprop = inflector.singularize(prop);
                    if (!sprop) {
                        sprop = prop;
                    }
                    sprop = capitalize(sprop);
                    if (!nosey[sprop]) {
                        continue;
                    }
                    mapping[prop] = (function (constructor) {
                        return {
                            create: function (options) {
                                return new constructor(options.data, self);
                            }
                        };
                    })(nosey[sprop]);
                }
            }
        }
        ko.mapping.fromJS(data, mapping, self);
        self.mode = ko.observable('abstract');
        iHaveTemplate(self);
    }

    function Header(data) {
        var self = this;
        data = data || {};
        initHelper(self, data, {
            type: 'header',
            value: undefined,
            name: undefined
        }, null);
    }
    function Address(data) {
        var self = this;
        data = data || {};
        initHelper(self, data, {
            type: 'address',
            address: undefined,
            name: undefined
        }, null);
    }

    function Email(data) {
        data = data || {};

        var self = this;
        initHelper(self, data, {
            type: 'email',
            subject: undefined,
            html: undefined,
            text: undefined,
            date: undefined,
            priority: undefined,
            headers: [],
            from: [],
            to: []
        }, {
            from: {
                create: function (options) {
                    return new Address(options.data);
                }
            },
            to: {
                create: function (options) {
                    return new Address(options.data);
                }
            }, headers:{
							create: function(options){
								return new Header(options.data);
							}
						}
        });
				self.remove = function(){
					self.mode('deleted');
				};
				self.showDetails = function(){
					self.mode('details');
				};
				self.showAbstract = function(){
					self.mode('abstract');
				};
    }

    function EmailCollection(data) {
        data = data || {};
        var self = this;
        initHelper(self, data, {
            type: 'email-collection',
            emails: []
        }, null);
				self.emails()[0].showDetails();
    }
    return {
        Email: Email,
        EmailCollection: EmailCollection
    };
})();
