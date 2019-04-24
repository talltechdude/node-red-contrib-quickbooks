module.exports = function(RED) {

    function Quickbooks(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var QuickBooksApi = require('node-quickbooks')

        try {
        	this.on('input', function(msg) {

        	    var configuration = RED.nodes.getNode(config.configuration);

        	    if(msg.configuration){
	        		configuration = msg.configuration;
        	    }

                    var clientID = configuration.clientID;
                    var clientSecret = configuration.clientSecret;
                    var accessToken = configuration.accessToken;
                    var refreshToken = configuration.refreshToken;
                    var realmId = configuration.realmId;
                    var sandbox;

                    var method = config.method;

                    if (configuration.destination) {
                        if(configuration.destination == 'Production'){
                    		sandbox = false;
                        }
                        else{
                    		sandbox = true;
                        }
                    }

					var qbo = new QuickBooksApi(clientID,
                        clientSecret,
                        accessToken, /* oAuth access token */
                        false, /* no token secret for oAuth 2.0 */
                        realmId,
                        sandbox, /* use a sandbox account */
                        true, /* turn debugging on */
                        4, /* minor version */
                        '2.0', /* oauth version */
                        refreshToken /* refresh token */);

                    var thisNode = this;

                    thisNode.status({fill:"green",shape:"dot",text:"working..."});

                    qbo[method](msg.payload, function(err, response) {

                	thisNode.status({});
                	var payload = {};
                	if(err){
                	    payload.error = err;
                	}
                	if(response){
                	    payload.response = response;
                	}
                	msg.payload = payload;
                        node.send(msg);
                    })

        	});
        }
    	catch(e){
    		node.error("Ops, there is an error...!", msg);
        }
    }

    function QuickbooksConfiguration(n) {

        RED.nodes.createNode(this,n);
        this.name = n.name;
        this.clientID = n.clientID;
        this.clientSecret = n.clientSecret;
        this.accessToken = n.accessToken;
        this.refreshToken = n.refreshToken;
        this.realmId = n.realmId;
        this.destination = n.destination;
    }

    RED.nodes.registerType("quickbooks", Quickbooks);
    RED.nodes.registerType("quickbooks-configuration", QuickbooksConfiguration);
}
