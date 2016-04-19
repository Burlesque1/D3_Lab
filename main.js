
d3.csv("car.csv",function(error,csvdata){
		
	if(error){
		console.log(error);
	}
	$(document).ready(function() {

			updateDimensions(csvdata);
			var data = [];

			var headerNames = d3.keys(csvdata[0]);

			for (var i = 0; i < headerNames.length; i++) {
				data[headerNames[i]] = [];
			}

			//load all values of each attribute into a seperate array  by Zhengixn
			for(var j = 0; j < csvdata.length; j++){
				var values = d3.values(csvdata[j]);
				for (var i = 0; i < headerNames.length; i++) {
					if(headerNames[i] != "origin"){
						if(headerNames[i] != "name")
							data[headerNames[i]].push(parseInt(values[i]));
						else
							data[headerNames[i]].push(values[i]);
					}
				}
			}

			//console.log(data);
			var padding = 20;
			var width = 400;
			var height = 400;

			var svg = d3.select(".plot")
						.append("svg")
						.attr("width", width)
						.attr("height", height);

			var xScale = d3.scale.linear()
			.domain([0,0])
			.range([0, width - 2 * padding]);

			var yScale = d3.scale.linear()
				.domain([0,0])
				.range([height - 2 * padding, 0]);

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(8);
				
			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(8);


			var rectPadding = 4;

		
			svg.append("g")
					.attr("class","x axis")
					.attr("transform","translate(" + padding + "," + (height - padding) + ")")
					.call(xAxis)
			    .append("text")
				    .attr("class", "label")
				    .attr("id", "x_lable")
				    .attr("x", width - 2 * padding)
				    .attr("y", -5)
				    .style("text-anchor", "end")
				    .text("");
				
			svg.append("g")
					.attr("class","y axis")
					.attr("transform","translate(" + padding + "," + padding + ")")
					.call(yAxis)
				.append("text")
			        .attr("class", "label")
				    .attr("id", "y_lable")
					.attr("transform", "rotate(-90)")
			        .attr("x", -5)
			        .attr("y", 10)
			        .style("text-anchor", "end")
			        .text("");

			//initiate axisx and lables, create svg  by Zhengxin
			
			
			$("#update").click( function(){

				var xAttribute = $("#sel-x").val();
				var yAttribute = $("#sel-y").val();
				var mpgMin = $("#mpg-min").val();
				var mpgMax = $("#mpg-max").val();
				if(xAttribute == yAttribute)
					window.alert("attribute of x-axis can not be the same with that of y-axis");
				else
					draw(data, xAttribute, yAttribute, mpgMin, mpgMax);
			});


		function updateDimensions(data){
			var headerNames = d3.keys(data[0]);
			for (var i = 0; i < headerNames.length; i++) {
				if(headerNames[i] != "name" && headerNames[i] != "origin"){
					$("#sel-x")
					.append("<option value=" + headerNames[i] + ">" + headerNames[i] + "</option>");

					$("#sel-y")
					.append("<option value=" + headerNames[(i+2)%7] + ">" + headerNames[(i+2)%7] + "</option>");
					}
				}
				//update the UI according to the csv header attributes by Zhengxin
				
				
				
				/*d3.select("#sel-x")
				.append("option")
				.attr("value", headerNames[i])
				.text(headerNames[i]);

				d3.select("#sel-y")
				.append("option")
				.attr("value", headerNames[i])
				.text(headerNames[i]);*/
			
			//console.log(headerNames);
		}


		function draw (data, xAttribute, yAttribute, mpgMin, mpgMax) {

			var dataset = [];
			for(var i = 0, index = 0; i < data[xAttribute].length; i++){
				if(data["mpg"][i] >= mpgMin && data["mpg"][i] <= mpgMax){
					dataset[index] = [];
					dataset[index].push(data[xAttribute][i]);
					dataset[index].push(data[yAttribute][i]);
					dataset[index].push(i);
					index++;
				}
			}
			//console.log(data);
			//filter the data by mpg-min and mpg-max  by Zhengixn
			//console.log(dataset);
				
			var xScale = d3.scale.linear()
				.domain([d3.min(data[xAttribute]) - 10, d3.max(data[xAttribute]) + 10])
				.range([0, width - 2 * padding]);

			var yScale = d3.scale.linear()
				.domain([d3.min(data[yAttribute]) - 10, d3.max(data[yAttribute]) + 10])
				.range([height - 2 * padding, 0]);

			var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.ticks(8);
				
			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(8);


			
			d3.selectAll("g.x.axis").call(xAxis);
			d3.select("#x_lable").text(xAttribute);

			d3.selectAll("g.y.axis").call(yAxis);
			d3.select("#y_lable").text(yAttribute);
			//update axises and labeles  by Zhengixn


			var updateDot = svg.selectAll(".dot")
							   .data(dataset);
			var enterDot = updateDot.enter();
			var exitDot = updateDot.exit();

			//get update, enter and exit part of the svg   updateDot

			updateDot
		    .attr("r", 5)
		    .attr("cx", function(d) {  
                  return xScale(d[0]) + padding;
                  //console.log(d);
            })
		    .attr("cy", function(d) {  
                return yScale(d[1]) + padding;
		    })
		    .style("fill", "black") 
		    .on("mouseover", function(d) {
		    	d3.select("#hovered").text(data["name"][d[2]]);
		      });

		    enterDot
		    .append("circle")
		    .attr("class", "dot")
		    .attr("r", 5)
		    .attr("cx", function(d) {  
                return xScale(d[0]) + padding;
            })
		    .attr("cy", function(d) {  
                return yScale(d[1]) + padding;
		    })
		    .style("fill", "black") 
		    .on("mouseover", function(d) {
		    	d3.select("#hovered").text(data["name"][d[2]]);

		    });
  			//console.log(data["name"]);

		      //remove  exit part by Zhengixn
		    exitDot.remove();
		 
		};



	});

});
			







