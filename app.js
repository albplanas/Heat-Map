
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

var Temp=new Array();
d3.json(url, function(data) {
    
    data.monthlyVariance.forEach(function(elem){
      Temp.push(parseFloat(Number.parseFloat(8.66+elem.variance).toFixed(1)));
      elem.month -= 1;
    });
    

    
    var section = d3.select("body")
        .append("section");
  
    var tooltip = d3.select("body").append("div")
      .attr("id", "tooltip")
      .style("opacity", 0);
  
    data.monthlyVariance.forEach(function(d){
    
  });
  
  
var max_temp=Math.max.apply(null,Temp);
var min_temp=Math.min.apply(null,Temp); 

    var color_Style=['blue','green','orange','red']  ;
           var array=new Array();
           var r=(max_temp-min_temp)/4;
           for(var i =0;i<=4;i++){
             array.push(min_temp+i*r); 
           }

   color_Scale = d3.scale.quantize()
                   .domain([min_temp, max_temp])
                   .range(color_Style);
   linear_color_Scale = d3.scale.linear()
                   .domain([min_temp, max_temp])
                   .range([0, 200]);
    
    var fontSize = 16;
    var width = 5*Math.ceil(data.monthlyVariance.length/12); //1500;
    var height = 33*12; //400;



    var svg =  d3.select('.container')
    .append('svg')
    .attr('width', width + 120)
    .attr('height', height + 100);

    
    //yaxis
    var yScale = d3.scale.ordinal()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) //months
      .rangeRoundBands([0, height]);
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .tickValues(yScale.domain())
      .tickFormat(function(month){
        var date = new Date(0);
        date.setUTCMonth(month);
        return d3.time.format.utc("%B")(date);
      })
      .orient("left")

    
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(100,20 )")
        .call(yAxis)

    
    //xaxis
    
    //ordinal scale
    var xScale = d3.scale.ordinal()
      .domain(data.monthlyVariance.map(function(val){return val.year}))
      .rangeRoundBands([0, width], 0, 0);
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickValues(xScale.domain().filter(function(year){
          //set ticks to years divisible by 10
          return year%10 === 0;
        }))
        .tickFormat(function(year){
          var date = new Date(0);
          date.setUTCFullYear(year)
          return d3.time.format.utc("%Y")(date);
        })
        .orient("bottom")
        .tickSize(10, 1);
    
    svg.append("g")
        .classed("x-axis", true)
        .attr("id", "x-axis")
        .attr("transform", "translate(100,415)")
        .call(xAxis)

    

    var legend_Axis = d3.svg.axis()
      .scale(color_Scale)   
      .orient("bottom")
    
  var legend = svg.selectAll(".legend")
   
    .data(color_Style)
    .enter().append("g")
    .attr("class", "legend")
    .attr("id", "legend")
legend.append("rect")
    .attr("x", (d, i) => (i * 50) +100)
    .attr("y", 450)
    .attr("width", 50)
    .attr("height", 18)
    .style("fill", (d)=>d)
    .call(legend_Axis);

  
      var legendAxis = d3.svg.axis()
        .scale( linear_color_Scale)
        .tickValues(array)
         .tickFormat(d3.format(".3s"))
        .orient("bottom")
        .tickSize(10, 1);
        
       
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(100,468)")
        .call(legendAxis)

  
    //map
    svg.append("g")
      .attr("transform", "translate( 100,20)")
      .selectAll("rect")
      .data(data.monthlyVariance)
      .enter().append("rect")
      .attr('class', 'cell')
  
      .attr('data-month',(d)=> d.month)
      .attr('data-temp',(d)=> data.baseTemperature + d.variance)
      .attr('data-year',(d)=> d.year)
  
      .attr("x", (d,i)=> xScale(d.year))
      .attr("y", (d,i)=> yScale(d.month))
      .attr("width", (d,i)=> xScale.rangeBand(d.year))
      .attr("height", (d,i)=> yScale.rangeBand(d.month))
       
      .attr("fill",(d,i)=> color_Scale(data.baseTemperature + d.variance))
    
  
  .on('mouseover', function(d, i) {
      
      d3.select(this).style("fill", "white");
      
      tooltip.transition()
              .duration(100)
              .style('opacity', .9);
      tooltip.html("Temperature: "+parseFloat(this.getAttribute('data-temp')).toFixed(2)+"<br>"+"Year: "+this.getAttribute("data-year"))
              .attr("data-year", this.getAttribute("data-year"))
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 30) + "px")
              .style('transform', 'translateX(60px)');
    
    })
    .on('mouseout', function(d,i) {
    
      d3.select(this).style("fill", color_Scale(this.getAttribute('data-temp')))
       tooltip.transition()
              .duration(100)
              .style('opacity', 0);
    });

});
