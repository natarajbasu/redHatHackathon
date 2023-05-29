 var color = "gray";
      var len = undefined;

      var nodes = [
		{
			"group": "interest",
			"id": "Art and creativity",
			"label": "Art and creativity"
		},
		{
			"group": "interest",
			"id": "Nature and the environment",
			"label": "Nature and the environment"
		},
		{
			"group": "interest",
			"id": "Travel and exploration",
			"label": "Travel and exploration"
		},
		{
			"group": "interest",
			"id": "Science and discovery",
			"label": "Science and discovery"
		},
		{
			"group": "location",
			"id": "1",
			"label": "Puducherry"
		},
		{
			"group": "location",
			"id": "2",
			"label": "Goa"
		},
		{
			"group": "location",
			"id": "3",
			"label": "Manali"
		},
		{
			"group": "location",
			"id": "4",
			"label": "Darjeeling"
		},
		{
			"group": "feature",
			"id": "Beach",
			"label": "Beach"
		},
		{
			"group": "feature",
			"id": "Shopping",
			"label": "Shopping"
		},
		{
			"group": "feature",
			"id": "Nightlife",
			"label": "Nightlife"
		},
		{
			"group": "feature",
			"id": "Mountains",
			"label": "Mountains"
		}
	];
      var edges = [
		{
			"from": "Art and creativity",
			"to": "1"
		},
		{
			"from": "Art and creativity",
			"to": "2"
		},
		{
			"from": "Art and creativity",
			"to": "4"
		},
		{
			"from": "Nature and the environment",
			"to": "1"
		},
		{
			"from": "Nature and the environment",
			"to": "2"
		},
		{
			"from": "Nature and the environment",
			"to": "3"
		},
		{
			"from": "Nature and the environment",
			"to": "4"
		},
		{
			"from": "Travel and exploration",
			"to": "2"
		},
		{
			"from": "Travel and exploration",
			"to": "1"
		},
		{
			"from": "Travel and exploration",
			"to": "3"
		},
		{
			"from": "Travel and exploration",
			"to": "4"
		},
		{
			"from": "Science and discovery",
			"to": "2"
		},
		{
			"from": "Science and discovery",
			"to": "3"
		},
		{
			"from": "1",
			"to": "Beach"
		},
		{
			"from": "1",
			"to": "Shopping"
		},
		{
			"from": "2",
			"to": "Nightlife"
		},
		{
			"from": "2",
			"to": "Beach"
		},
		{
			"from": "3",
			"to": "Nightlife"
		},
		{
			"from": "3",
			"to": "Mountains"
		},
		{
			"from": "4",
			"to": "Shopping"
		},
		{
			"from": "4",
			"to": "Mountains"
		}
	];
function openNav() {
 
   var container = document.getElementById("openPopup");
   
      
      var data = {
        nodes: nodes,
        edges: edges,
      };
      var options = {
        nodes: {
          shape: "dot",
          size: 20,
          font: {
            size: 12,
            color: "#ffffff",
          },
          borderWidth: 2,
        },
        edges: {
          width: 2,
        },
      };
      network = new vis.Network(container, data, options);
      var popUp=document.querySelector(".full-screen");
     popUp.classList.toggle('hidden-pop');
     document.getElementById("closeDiv").style.display="block";
}

function closeNav() {
	
     var popUp=document.querySelector(".full-screen");
     popUp.classList.toggle('hidden-pop');
       document.getElementById("closeDiv").style.display="none";
}
      // create a network
     