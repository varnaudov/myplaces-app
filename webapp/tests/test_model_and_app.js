var should = chai.should();

/**
 * Application-related tests (note, in real life, those would be probably in different
 * test suite files
 */
describe("Application", function() {
   it("Tests if app is loaded and succesfully initialized", function() {
      should.exist(app);
      app.headerView.$el.text().should.have.string("Map")
   });
   it("Tests a simple view for model/render (PlaceListItemView)", function() {
	   	  this.myplace1 = new MyPlace();
	   	  this.myplace1.set({name: "myTestPlace", address: "myTestAddress"});
	   	  this.detailsListItem = new PlaceListItemView({model:this.myplace1});
	   	  this.detailsListItem.render();
	   	  this.detailsListItem.$el.text().should.have.string("myTestPlace");
	   });
});

/**
 * A couple of tests for our model. Add a model to a collection
 * Test our client-side validation positive/negative
 */
describe("Model", function() {
	   beforeEach(function() {
	      this.myplacecoll = new MyPlaceCollection();
	      this.myplace1 = new MyPlace();
	      this.myplace1.set({name: "myTestPlace", address: "myTestAddress"});
	      this.myplacecoll.add(this.myplace1);
	      this.myplace2 = new MyPlace();
	      this.myplace2.set({name: "myTestPlace2", address: "myTestAddress2"});
	      this.myplacecoll.add(this.myplace2);
	   });
	   it("Tests creation of collection", function() {
		      should.exist(this.myplacecoll);
		      should.equal(this.myplacecoll.size(),2);
		   });
	   it("Tests retrieve a model out of it", function() {
		      should.equal(this.myplacecoll.at(0).attributes.address,"myTestAddress");
		   });
	   it("Tests positive single field validation", function() {
		      should.equal(this.myplacecoll.at(0).validateItem("name").isValid,true);
		   });
	   it("Tests positive all fields validation", function() {
		      should.equal(this.myplacecoll.at(0).validateAll().isValid, true);
		   });
	   it("Tests negative all fields validation", function() {
		   this.myplaceInvalid = new MyPlace();
		      this.myplaceInvalid.set({name: "myTestPlace"});
		      this.myplacecoll.add(this.myplaceInvalid);
		      should.equal(this.myplacecoll.at(2).validateAll().isValid, false);
		      should.equal(this.myplacecoll.at(2).validateAll().messages.address, "Enter a valid address");
		   });
	});