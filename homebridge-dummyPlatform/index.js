var Accessory, Service, Characteristic, UUIDGen;
//regist platform
module.exports = function(homebridge){



	// Accessory must be created from PlatformAccessory Constructor
    Accessory = homebridge.platformAccessory;

	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	UUIDGen = homebridge.hap.uuid;


	// homebridge.registerAccessory("homebridge-dummyPlatform", "DummyPlatform", DummyPlatform, true);
	homebridge.registerPlatform("homebridge-dummyPlatform", "DummyPlatform", DummyPlatform, true);
}
// Platform constructor
// config may be null
// api may be null if launched from old homebridge version
function DummyPlatform(log, config, api) {
	this.log = log;
	this.config = config;
  	this.accessories = [];
	//realtime polling info
	this.switchState = false;

	if (api) {
		// Save the API object as plugin needs to register new accessory via this object.
		this.api = api;
		// Listen to event "didFinishLaunching", this means homebridge already finished loading cached accessories
		// Platform Plugin should only register new accessory that doesn't exist in homebridge after this event.
		// Or start discover new accessories
		this.api.on('didFinishLaunching', function() {
			this.log("DidFinishLaunching");
			// console.log("==========type of api " + Object.keys(this));
			this.log("-=======type: " + Object.keys(api.hap));
			this.addAccessory();
		}.bind(this));
  }
}

DummyPlatform.prototype = {

	//status input/output for light
	setSwitchPowerState: function(powerOn, callback) {
		this.log('set switch state' + powerOn);
		this.switchState = powerOn;
		callback();
	},

	getSwitchPowerState: function(callback) {
		callback(null, this.switchState);
	},

	identify: function(callback) {
		this.log("Identify requested!");
		callback(); // success
	},

	addAccessory: function() {
		this.log("Add Accessory");
		var platform = this;
		var uuid;

		uuid = UUIDGen.generate("Realank Light");

		// Plugin can save context on accessory
		// To help restore accessory in configureAccessory()
		// newAccessory.context.something = "Something"

		// Make sure you provided a name for service otherwise it may not visible in some HomeKit apps.


		var accessory = new Accessory("Realank Light", uuid);

		var accessoryExist = this.accessories[accessory.UUID] != null


		if (accessoryExist) {
			accessory = this.accessories[accessory.UUID];
		}

		var informationService = accessory.getService(Service.AccessoryInformation);
		if (informationService) {
			this.log("update information");
			informationService
			.updateCharacteristic(Characteristic.Manufacturer, "Dummy Manufacturer")
			.updateCharacteristic(Characteristic.Model, "Dummy Model")
			.updateCharacteristic(Characteristic.SerialNumber, "Dummy Serial Number");
		}

		accessory.on('identify', function(paired, callback) {
			platform.log(accessory.displayName, "Identify!!!");

			callback();
		});
		
		var lightService
		if (!accessoryExist) {
			lightService =  accessory.addService(Service.Lightbulb, "Realank Lightbulb")

		}else{
			lightService =  accessory.getService(Service.Lightbulb, "Realank Lightbulb")
		}
		lightService
		.getCharacteristic(Characteristic.On)
		.on('get', function(callback) {callback(null, this.switchState)})
		.on('set',  this.setSwitchPowerState.bind(this));

		// newAccessory.addService(informationService)
		if (!accessoryExist) {
			this.api.registerPlatformAccessories("homebridge-dummyPlatform", "DummyPlatform", [accessory]);
		}
		this.accessories[accessory.UUID] = accessory;

		this.log("Add Accessory Done");
	},

	configureAccessory : function(accessory) {
		this.log(accessory.displayName, "Configure Accessory");
		this.accessories[accessory.UUID] = accessory;
		accessory.updateReachability(true);
		// this.api.unregisterPlatformAccessories("homebridge-dummyPlatform", "DummyPlatform", [accessory]);
		// this.api.updatePlatformAccessories([accessory]);
		this.log(accessory.displayName, "Configure Accessory Done");
	},

	configurationRequestHandler : function(context, request, callback) {
		this.log("configurationRequestHandler");
	    var self = this;
	    var respDict = {};

	    if (request && request.type === "Terminate") {
	        context.onScreen = null;
	    }
	}




};
