# Using Angular Data Driven Modals
![Screenshot](readmeImages/Screenshot.png)
### Requirements
* A good working knowledge of [Angular.js](https://angularjs.org/) and its different componenets.
* A firm grasp of how [Bootstrap](getbootstrap.com) works. Particularly what modals are and how they work.
* Knowing how to write JSON is also helpful but not nessasarily required.


## Brief Overview

### Why?

When designing a [Angular.js](https://angularjs.org/) application that handles an abundance of form data it can quickly become unmanageable. If you are like me and have a bunch of forms that only differ by a fiew fields it can be infuriating to have to write two separate form templates each with their own set of control methods. This becomes even more of a nightmare when you have 20+ different forms that each have to be collected and updated from a database. In comes this handy library! Angular-Data-Driven-Modals allows you to specify only what the data looks like and like magic you get both a means of adding and updating your data in convient [Bootstrap](getbootstrap.com) modal forms.

### Basic procedure

* Include this library as a part of your project (and change app name)
* Implement a AngularJS service with the ModalService dependency
* Define a model in this service and allow access to it through a getModel() function
* Define a submit method in this service to gain access to the outgoing data
* Compile your this model using the compileModel() method
* Attach the modal to an object in your DOM and PRESTO!

## Modal Directive
First off, you must include the [modalDirective.js](modalDirective.js) and [modalService.js](modalService.js) file into your project,
```html
<script src="modules/modalService.js"></script>
<script src="modules/modalDirective.js"></script>
```
By convention I would place these into their own modules folder but this is your choice.

### Note
You may need to modify the app name to match yours in the [modalDirective.js](modalDirective.js).
         
## Include Service
To implement your own data driven modal you need to have a service to support it. A full example of which can be seen in the [modalDataServiceExample.js](modalDataServiceExample.js) file.

         
## Implement Method
```javascript
// this method must be implemented in your angular service
this.getModel = function () {
	return model;
};
```
As AngularJS has no means of creating interfaces as in Java you must remember to implement this method on your own. Its function is straightforward as it simply allows public access to your local model variable.
         
## Model Structure
```javascript
var onSubmit = function(obj){
	console.log(obj);
};

var model = {
	// The structure of the input fields
	fields: [
		{name: "id", display: false}, // this item is preserved but not displayed
        // follows a simalar naming patter as the input fields would
		{name: "name", displayName: "Name", placeholder: "Panel [a,b,etc...]", type: "text", required: true},
		{name: "mac", displayName: "MAC", placeholder: "0x36000...", type: "text", required: true},        
        ...
	],
    // Add mode settings
	addModalSettings: {
		title: 'Add New Panel',
        // the submission callback function above. All fields are placed into a new object
		callback: this.onSubmit 
	},
	editModalSettings: {
		...
	}
};

// other getters and setters here
```
Remember, a full example of this can be found in the [modalDataServiceExample.js](modelDataServiceExample.js) file.
         
## Compile Model
model = ModalService.compileModel(model);
         
## Attach to DOM
```html
<button class="btn btn-primary" modal ng-service="PanelDataService">Add Panel</button>
```
This directive uses the existance of the the ng-model="" attribute as its means of differentiating between a modal that is in add mode and edit mode.


** I will be creating a plnkr soon to show a working example of this code. **
