var new_group_list = new Array();
var origin_axis;
var axis_text = new Array();
var brushes = new Array();

function draw_group_histogram(position, data, dataset, turn){
    var width = 350, height = 150, rectWidth = 11;
    if(Object.keys(dataset).length > 12){
        rectWidth = width / (2 * Object.keys(dataset).length + 4);
    }
    console.log("rectWidth", rectWidth)
    console.log("dataset.length", dataset.length)
    var padding = {left:5, right:0, top:5, bottom:5};

    new_group_list = [];
    new_group_list = Object.keys(dataset)
    var compare = function(x,y){
        if(x<y){return -1;}
        else if(x>y){return 1;}
        else{return 0;}
    }

    var compare_value = function(x,y){
        if(dataset[x].length < dataset[y].length){return 1;}
        else if(dataset[x].length > dataset[y].length){return -1;}
        else{return 0;}
    }
    if(data.name == 'P. Year' || data.name == 'C. Year'){
        new_group_list.sort(compare);
    }
    else{
        new_group_list.sort(compare_value);
    }

    var histogram_svg = position.append('svg')
                            .attr("id", "group_histogram_id")
                            .attr("x", -width - 30)
                            .attr("y", function(){
                                return data.y + 20;
                            })
                            .attr('width', width)
                            .attr('height', height+100);

    var xScale = d3.scale.ordinal()
                .domain(d3.range(0,new_group_list.length))
                //.range([0,width-padding.left-padding.right]);
                .rangeRoundBands([0, new_group_list.length * (rectWidth * 2 )]);

    var y_max = 0;
    for(var i in new_group_list){
        if(y_max < dataset[new_group_list[i]].length){
            y_max = dataset[new_group_list[i]].length;
        }
    }
    var g_yScale = d3v4.scaleLinear()
            //.domain([0,d3.max(dataset) + 5])
            .domain([0, y_max])
            .range([height-padding.bottom-padding.top,20]);
        
    if(scale_method % 3 == 1){
        g_yScale = d3v4.scaleSqrt()
        .domain([0, y_max])
        .range([height-padding.bottom-padding.top,20]);
    }
    else if(scale_method % 3 == 2){
        g_yScale = d3v4.scaleLog()
        .domain([1, y_max+1])
        .range([height-padding.bottom-padding.top,20]);
    }

    var x_list = [];
    axis_text = [];
    var begin = -1;
    for(var i = 0; i < new_group_list.length; i ++){
        axis_text[i] = new Object();
        axis_text[i].num = i;
        axis_text[i].x = xScale(i) + rectWidth/2 + 15;
        x_list.push(axis_text[i].x);
        axis_text[i].last = begin;
        axis_text[i].next = i + 1;
        if(dataset[new_group_list[i]]){
            axis_text[i].length = dataset[new_group_list[i]].length;
        }
        else{
            axis_text[i].length = 0;
        }
        if(scale_method % 3 == 2){
            axis_text[i].length += 1;
        }
        begin = i;
        axis_text[i].name = new_group_list[i];
    }

    var rects = histogram_svg.selectAll('.group_rect')
        .data(axis_text)
        .enter()
        .append('rect')
        .attr('class','group_rect')
        .attr('id', 'group_rect')
        .attr("transform","translate(" + padding.left + "," + padding.top + ")")
        .attr('x',function(d,i){
            return xScale(i) + rectWidth/2 + 15;
        }).attr('y',function(d){
            return (g_yScale(d.length) - 15);
        })
        .attr('width',xScale.rangeBand() - rectWidth)
        .attr('height',function(d){
            return height-padding.bottom-padding.top-g_yScale(d.length);
        })
        .attr('fill', 'lightgray');

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
                        
//定义y轴
    var yAxis = d3.svg.axis()
        .scale(g_yScale)
        .orient("left");
    
    histogram_svg.append('g')
        .attr('class','axis')
        .attr('id', 'group_histogram_xid')
        .attr("transform","translate(" + (padding.left + 15) + "," + (height - padding.bottom - 15) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("class", "group_axis")
        .attr("id", "group_axis")
        .data(axis_text)
        .attr("transform", function(){
            if(axis_text.length >= 30){
                return "translate(" + (7 +xScale.rangeBand() - rectWidth) + ",6)rotate(90)";
            }
            else{
                return "";
            }
        })
        .text(function(d){
            if(data.name == 'P. Venue' || data.name == 'C. Venue'){
                return d.name.substring(0, d.name.indexOf('~'));
            }
            return d.name;
        })
        .style("text-anchor",function(){
            if(axis_text.length >= 30){
                return "start";
            }
            else{
                return "middle";
            }
        })
        .attr("font-family", "Arial")
        .attr("font-size", function(){
            if(rectWidth == 11){
                return 8;
            }
            else{
                return 4;
            }
        })
        .on("mouseover", function(){
            d3.select(this)
            .style("cursor", "pointer")
            .attr("font-size", 15);
        })
        .on("mouseout", function(){
            d3.select(this)
            .attr("font-size", function(){
                if(rectWidth == 11){
                    return 8;
                }
                else{
                    return 4;
                }
            })
        });
        //.call(drag_axis);

    

    histogram_svg.append('g')
        .attr('class','axis')
        .attr('id', 'group_histogram_yid')
        .attr("transform","translate(" + (padding.left + 15) + "," + (padding.top-15) + ")")
        .call(yAxis)
        .selectAll("text")
        .text(function(d){
            var num = 5;
            if(y_max >= 100){
                num = 50;
            }
            else if(y_max > 10){
                num = 10;
            }
            else if(y_max <= 10){
                num = 2;
            }

            if(d%num == 0.0){
                return d;
            }
            else{
                return '';
            }
        })
        .attr("font-family", "Arial")
        .style("font-size", function(){
            if(y_max >= 100){
                return "7px";
            }
            else if(y_max >= 1000){
                return "5px";
            }
            return "10px";
        })
        .style("fill", Unclickable_name_color);

    
    var show = position.append("g").attr("class", "show_group_choice")
        .attr("id", "show_group_choice")
        .attr("transform", function(){
            //return "translate(" + (width + 10) + "," + height/2 + ")";
            return "translate(0,0)";
        });

    show.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", -20)
        .attr("y", function(){
            return data.y + height / 2;
        })
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", "url(#ArrowPattern)")//"rgb(161,217,155)")
        .style("opacity", 0.5)
        .style("cursor", "pointer")
        .on("mouseover", function(){
            d3.select(this)
                .style("opacity", 1);
        })
        .on("mouseout", function(){
            d3.select(this)
                .transition()
                .duration(100)
                .style("opacity", 0.5);
        })
        .on("click", function(){
            Change_by_group(data, axis_text, rectWidth, turn);
        });

    // show.append("text")
    //     .text(">")
    //     .attr("x", -12)
    //     .attr("y", function(){
    //         return data.y + height / 2 + 12;
    //     })
    //     .attr("font-size", "10")
    //     .attr("font-face", "Courier New bold");

    var gBrushes = histogram_svg.append("g")
                            .attr("calss", "brushes")
                            .attr("id", "brushes");

    var group_titles = histogram_svg.append("g")
                            .attr("class", "group_titles")
                            .attr("id", "group_titles")
                            .attr("transform", function () {
                                return "translate(17," + (g_yScale(y_max) - 12) + ")";
                            });

    brushes = [];
    // if(Show_Sunbursts_all[turn]['group_lists'].hasOwnProperty(data.name)){
    //     brushes = Show_Sunbursts_all[turn]['group_lists'][data.name]['brushes'];
    // }
    var has_color_rec = new Array();

    new_Brush();
    draw_Brushes();
    color_group();

    function color_group(){
        var sorted_brushes = brushes.slice(0, brushes.length);
        if(brushes[brushes.length - 1].brush.extent.start === undefined){
            sorted_brushes = brushes.slice(0, brushes.length-1);
        }

        sorted_brushes.sort(function (a, b) {
            return a.brush.extent()[0] - b.brush.extent()[0]
        });

        has_color_rec = [];
        var nodes = document.getElementById("group_histogram_id").childNodes;
        for(var i = 0; i < nodes.length; i++){
            if(nodes[i].tagName == 'rect'){
                has_color_rec.push(0)
            }
        }

        var color_rank = 0;
        sorted_brushes.forEach(function(brush){
            var extent = brush.brush.extent();
            extent[0] = extent[0] + 11.5;
            extent[1] = extent[1] + 11.5;
          
            for(var i = 0; i < nodes.length; i++){
                if(nodes[i].tagName == 'rect'){
                    if(((nodes[i].x.animVal.value+rectWidth) >= extent[0]) && (nodes[i].x.animVal.value < extent[1])){
                        if(color_rank % 2 == 0){
                            d3.select(nodes[i]).attr("fill", d3.rgb(102, 184, 100));
                        }
                        else{
                            d3.select(nodes[i]).attr("fill", d3.rgb(185, 250, 80));
                        }
                        has_color_rec[i] = 1;
                    }
                }
            }
            color_rank += 1;
        })

        for(var i = 0; i < nodes.length; i++){
            if(has_color_rec[i] == 0){
                d3.select(nodes[i]).attr("fill", "lightgray");
            }
        }
    }

    function getBrushesAround(brush, brushes) {
        var edge = [];
        if (brush.extent.start === undefined){
            brush.extent.start = brush.extent();
        }
        brushes.forEach(function (otherBrush, i) {
            var otherBrush_extent = otherBrush.extent();
            if (otherBrush !== brush) {
                if (brush.extent.start !== undefined && otherBrush_extent[1] <= brush.extent.start[0]) {
                    if (edge[0] !== undefined && otherBrush_extent[1] > edge[0][1] || edge[0] === undefined) {
                        edge[0] = [];
                        edge[0][0] = i;
                        edge[0][1] = otherBrush_extent[1];
                    }
                } else if (brush.extent.start !== undefined && otherBrush_extent[0] > brush.extent.start[0]) {
                    if (edge[1] !== undefined && otherBrush_extent[0] < edge[1][1] || edge[1] === undefined) {
                        edge[1] = [];
                        edge[1][0] = i;
                        edge[1][1] = otherBrush_extent[0];
                    }
                }
            }
        });
        return edge;
    }

    function new_Brush(){
        var brush = d3.svg.brush().x(xScale)
                    .on("brushstart", brushStart)
                    .on("brush", brushIng)
                    .on("brushend", brushEnd);

        brushes.push({id: brushes.length, brush: brush, title: ("G" + brushes.length), content:[], title_revise: 0});

        function brushStart(){
        };

        function brushIng(){
            var extent = brush.extent();
            //find out what surrounds this brush
            var edge = getBrushesAround(brush, brushes.map(function (d) {
                return d.brush
            }));

            Remove_nodechildren("group_titles");

            var childrens = document.getElementById("group_histogram_xid").children;
            for(var child_len = 0; child_len < childrens.length; child_len ++){
                if(childrens[child_len].tagName == "g"){
                    if((parseFloat(window.getComputedStyle(childrens[child_len]).transform.split(",")[4]) + rectWidth) >= extent[0] && window.getComputedStyle(childrens[child_len]).transform.split(",")[4] <= extent[1]){
                        if(child_len > 0 && child_len < childrens.length -2 && ((parseFloat(window.getComputedStyle(childrens[child_len-1]).transform.split(",")[4]) + rectWidth) < extent[0] || window.getComputedStyle(childrens[child_len+1]).transform.split(",")[4] > extent[1])){
                            d3.select(childrens[child_len].children[1])
                            .attr("font-size", 15);
                        }
                        else if(child_len == childrens.length - 2){
                            d3.select(childrens[child_len].children[1])
                            .attr("font-size", 15);
                        }
                        else if(child_len == 0){
                            d3.select(childrens[child_len].children[1])
                            .attr("font-size", 15);
                        }
                        else{
                            d3.select(childrens[child_len].children[1])
                            .attr("font-size", function(){
                                if(rectWidth == 11){
                                    return 8;
                                }
                                else{
                                    return 4;
                                }
                            })
                        }
                    }
                    else{
                        d3.select(childrens[child_len].children[1])
                        .attr("font-size", function(){
                            if(rectWidth == 11){
                                return 8;
                            }
                            else{
                                return 4;
                            }
                        })
                    }
                }
            }

            //if the current block gets brushed beyond the surrounding block, limit it so it does not go past
            if (edge[1] !== undefined && extent[1] > edge[1][1] && d3.event.mode !== "move") {
                var t_index = edge[1][0]
                var edge_extent = [];
                var edge_brush = brushes[t_index].brush
                edge_extent[0] = extent[1]
                edge_extent[1] = edge_brush.extent.start[1]
                edge[1][1] = extent[1];
                //edge_brush.extent(edge_extent);
                d3.selectAll(".brush")
                    .filter(function (ibrush, i) {
                        //console.log(i + ":" + ibrush.brush.extent)
                        return (ibrush === brushes[t_index]);
                    })
                    .call(edge_brush.extent(edge_extent));

            } else if (edge[1] !== undefined && extent[1] > edge[1][1] && d3.event.mode === "move") {
                //if we are moving, not only do we stop it from going past, but also keep the brush the same size
                extent[1] = edge[1][1];
                extent[0] = extent[1] - (brush.extent.start[1] - brush.extent.start[0])
            }
            else if (edge[0] !== undefined && extent[0] < edge[0][1] && d3.event.mode !== "move") {
                var t_index = edge[0][0]
                var edge_extent = [];
                var edge_brush = brushes[t_index].brush;
                edge_extent[1] = extent[0]
                edge_extent[0] = edge_brush.extent.start[0]
                edge[0][1] = extent[0];
                //edge_brush.extent(edge_extent);
                d3.selectAll(".brush")
                    .filter(function (ibrush, i) {
                        return (ibrush === brushes[t_index]);
                    })
                    .call(edge_brush.extent(edge_extent));

            } else if (edge[0] !== undefined && extent[0] < edge[0][1] && d3.event.mode === "move") { 
                extent[0] = edge[0][1];
                extent[1] = extent[0] + (brush.extent.start[1] - brush.extent.start[0])
            }
            d3.select(this).call(brush.extent(extent));
            color_group(); 
        }
        
        function brushEnd(){
            brush.extent.start = brush.extent();
            //var const_brushes = brushes.slice(0, brushes.length-1);
            var const_brushes = brushes.slice(0, brushes.length);        
            var full = 0;

            // console.log(brush.extent())

            var childrens = document.getElementById("group_histogram_xid").children;
            for(var child_len = 0; child_len < childrens.length; child_len ++){
                if(childrens[child_len].tagName == "g"){
                    d3.select(childrens[child_len].children[1])
                        .attr("font-size", function(){
                            if(rectWidth == 11){
                                return 8;
                            }
                            else{
                                return 4;
                            }
                        })
                }
            }

            for(var i = 0; i < const_brushes.length; i ++){
                var const_extent = const_brushes[i].brush.extent();
                if(brushes[i].brush.extent.start != undefined ){
                    const_extent[0] = const_extent[0] + 11.5;
                    const_extent[1] = const_extent[1] + 11.5;
                }
                var const_content = new Array();
                var judgenew = 0;
                for(var j = 0; j < x_list.length; j++){
                    if(((x_list[j]+rectWidth) >= const_extent[0]) && (x_list[j] < const_extent[1])){
                        judgenew = 1;
                        const_content.push(new_group_list[j]);
                    }
                }

                if(judgenew == 0){
                    if(brushes[i].brush.extent.start === undefined){
                    }
                    else{
                        brushes.splice(i, 1);
                    }
                }
                else{
                    brushes[i].content = const_content;
                    if(brushes[i].title_revise == 0){
                        if(const_content.length == 1){
                            if(data.name == 'P. Venue' || data.name == 'C. Venue'){
                                brushes[i].title = const_content[0].substring(0, const_content[0].indexOf('~'));
                            }
                            else{
                                brushes[i].title = const_content[0];
                            }
                        }
                        else{
                            if(data.name == 'P. Venue' || data.name == 'C. Venue'){
                                brushes[i].title = const_content[0].substring(0, const_content[0].indexOf('~')) + "-" + const_content[const_content.length-1].substring(0, const_content[const_content.length-1].indexOf('~'));
                            }
                            else{
                                brushes[i].title = const_content[0] + "-" + const_content[const_content.length-1];
                            }
                        }
                    }
                    full += 1;
                }
            }

            if(full == brushes.length){
                new_Brush();
            }

            draw_Brushes();

            color_group();                
        }

        //var lastBrushExtent = brushes[brushes.length - 1].brush.extent();

        //var lastBrushExtent = brush.extent();

        //var judgenew = 0;
        //var nodes = document.getElementById("group_histogram_id").childNodes;
        //for(var i = 0; i < nodes.length; i++){
        //    if(nodes[i].tagName == 'rect'){
        //        if((nodes[i].x.animVal.value >= lastBrushExtent[0]) && (nodes[i].x.animVal.value < lastBrushExtent[1])){
        //            judgenew = 1;
        //            break;
        //        }
        //    }
        //}
        
        //if(judgenew == 1){
        //    new_Brush();
        //}
    }

    function draw_Brushes(){
        var gBrush = gBrushes
            .selectAll('.brush')
            .data(brushes, function (d) {
                return d.id
            });
    
        gBrush.enter()
            .insert("g", '.brush')
            .attr('class', 'brush')
            .attr('id', function(brush){
                return "brush-" + brush.id;
            })
            .each(function (brushWrapper) {
                //call the brush
                return brushWrapper.brush(d3.select(this));
            });
    
        gBrush.each(function (brushWrapper, i) {
                d3.select(this)
                    .attr('class', 'brush')
                    .attr("transform", function () {
                        return "translate(17," + (g_yScale(y_max) - 12) + ")";
                    })
                    .selectAll('.background')
                    .style('pointer-events', function () {
                        var brush = brushWrapper.brush;
    
                        return i === brushes.length - 1 &&
                        brush !== undefined &&
                        brush.extent()[0] === brush.extent()[1]
                            ? 'all' : 'none';
                    });

                d3.select(this)
                    .selectAll('.extent')
                    .attr("x", function(){
                        return brushWrapper.brush.extent()[0];
                    })
                    .attr("width", function(){
                        return brushWrapper.brush.extent()[1] - brushWrapper.brush.extent()[0];
                    });
            })
    
        gBrush.selectAll('rect')
            .attr("height", height- 10 -g_yScale(y_max));
    
        gBrush.selectAll(".resize").append("path").attr("id", "group_resize").attr("d", resizePath);
    
        function resizePath(d) {
            var e = +(d == "e"),
                x = e ? 1 : -1,
                y = height / 7;
            return "M" + (.5 * x) + "," + y
                + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
                + "V" + (2 * y - 6)
                + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
                + "Z"
                + "M" + (2.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8)
                + "M" + (4.5 * x) + "," + (y + 8)
                + "V" + (2 * y - 8);
        }

        gBrush.each(function (brushWrapper, i) {
            d3.select(this)
                .selectAll('.resize e')
                .attr("tranform", function(){
                    return "translate(" + brushWrapper.brush.extent()[1] + ",0)";
                });
            d3.select(this)
                .selectAll('.resize w')
                .attr("tranform", function(){
                    return "translate(" + brushWrapper.brush.extent()[0] + ",0)";
                });
        })
    
        gBrush.exit()
            .remove();

        Remove_nodechildren("group_titles");

        var sorted_brushes = brushes.slice(0, brushes.length);
        if(brushes[brushes.length - 1].brush.extent.start === undefined){
            sorted_brushes = brushes.slice(0, brushes.length-1);
        }

        group_titles.selectAll(".group_title")
            .data(sorted_brushes)
            .enter()
            .append("foreignObject")
            .attr("id", function(brush, i){
                return "group_title" + i;
            })
            .attr("x", function(brush){
                return brush.brush.extent()[0];
            })
            .attr("y", function(brush, i){
                return 100 - 12*i;
            })
            .attr("width", 150)
            .attr("height", 20)
            .html(function(brush){
                return "<input type='text' value=" + "'" + brush.title + "' id='brush_content_" + brush.id +
                "' style='background-color:rgba(0,0,0,0); border: none; font-family: Arial; font-size: 10;'/>";
            });

        this_svg = group_titles.append("svg")

        this_svg.selectAll(".group_ignores")
            .data(sorted_brushes)
            .enter()
            .append("rect")
            .attr("id", function(brush, i){
                return "group_ignore" + i;
            })
            .attr("x", function(brush){
                return brush.brush.extent()[0];
            })
            .attr("y", function(brush, i){
                return 0;
            })
            .attr("width", 10)
            .attr("height", 10)
            .attr("rx", 2)
            .attr("ry", 2)
            .style("fill", "url(#NotPattern)")//"rgb(161,217,155)")
            .style("opacity", 0.5)
            .style("cursor", "pointer")
            .on("mouseover", function(){
                d3.select(this)
                .style("opacity", 1)
            })
            .on("mouseout", function(){
                d3.select(this)
                .style("opacity", 0.5)
            })
            .on("click", function(d, i){
                d.title = "ignore";
                document.getElementById("brush_content_" + d.id).value = "ignore";
                for(var j = 0; j < brushes.length; j ++){
                    if(brushes[j].id == d.id){
                        brushes[j].title = document.getElementById("brush_content_" + d.id).value;
                        brushes[j].title_revise = 1;
                    }
                }
            });

        for(var i = 0; i < sorted_brushes.length; i++){
            var this_id = sorted_brushes[i].id;
            d3.select('#brush_content_' + this_id)
                .on('change', function(){
                    for(var j = 0; j < brushes.length; j ++){
                        if(brushes[j].id == this_id){
                            brushes[j].title = document.getElementById("brush_content_" + this_id).value;
                            brushes[j].title_revise = 1;
                        }
                    }
                });
        }

    }
    
}



function Change_by_group(data, axis_text, rectWidth, turn){
    brushes.splice(brushes.length-1,1)
    brushes.sort(function (a, b) {
        return a.brush.extent()[0] - b.brush.extent()[0]
    });
    var have_group_list = new Object();
    var have_reference = new Array();

    brushes.forEach(function(brush,k){
        brushes[k].id = k;
        for(var i = 0; i < brush.content.length; i++){
            have_group_list[brush.content[i]] = brush.title;
            have_reference.push(brush.content[i])
        }
    })

    for(var i = 0; i < new_group_list.length; i++){
        if(have_reference.indexOf(new_group_list[i]) == -1){
            have_group_list[new_group_list[i]] = new_group_list[i];
        }
    }

    console.log(have_group_list)

    Show_Sunbursts_all[turn]['group_lists'][data.name] = new Object();
    Show_Sunbursts_all[turn]['group_lists'][data.name]['lists'] = have_group_list;
    Show_Sunbursts_all[turn]['group_lists'][data.name]['brushes'] = brushes;

    var number = 5;
    (function() {
        //var test = "http://98.220.5.15:1234/user";
        var test = "http://140.82.48.134:1234/user";
        $.getJSON( test, {
            num : number,
            list: JSON.stringify(Show_Sunbursts_all[turn]['paper_list']),
            property: Show_Sunbursts_all[turn]['show_property'],
            group_by: JSON.stringify(Show_Sunbursts_all[turn]['show_group_by']),
            group_lists: JSON.stringify(Show_Sunbursts_all[turn]['group_lists'])
        })
        .done(function( data ) {
            if(data['num'] == '0'){
                if(turn == 'up'){
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        downdraw = 0;
                        align_num = 0;
                        drawSun('down', data['tree']);
                    }

                    updraw = 0;
                    drawSun('up', data['tree']);
                }
                else{
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        updraw = 0;
                        align_num = 0;
                        drawSun('up', data['tree']);
                    }

                    downdraw = 0;
                    drawSun('down', data['tree']);
                }
            }
        });
    })(); 
}

var drag_axis = d3.behavior.drag()
    .origin(function(d) { 
            return d;
    })
    .on("dragstart", dragstarted_axis)
    .on("drag", dragged_axis)
    .on("dragend", dragended_axis);

function dragstarted_axis(d){
    origin_axis = d.x;
}

function dragged_axis(d){
    d.x += d3.event.dx;
    if(d.next < axis_text.length){
        if(d.x >= axis_text[d.next].x){
            var next = d.next;
            var temp_x = axis_text[next].x;
            if(d.last >= 0){
                axis_text[d.last].next = d.next;
            }
            if(axis_text[axis_text[d.next].next] != undefined){
                axis_text[axis_text[d.next].next].last = d.num;
            }
            d.next = axis_text[next].next;
            axis_text[next].next = d.num;
            axis_text[next].last = d.last;
            d.last = next;
            axis_text[next].x = origin_axis;
            d.x = temp_x;
            origin_axis = temp_x;
        }
    }
    if(d.last >= 0){
        if(d.x <= axis_text[d.last].x){
            var last = d.last;
            var temp_x = axis_text[d.last].x;
            if(d.next < axis_text.length){
                axis_text[d.next].last = d.last;
            }
            if(axis_text[axis_text[d.last].last] != undefined){
                axis_text[axis_text[d.last].last].next = d.num;
            }
            d.last = axis_text[d.last].last;
            axis_text[last].next = d.next;
            axis_text[last].last = d.num;
            d.next = last;
            axis_text[last].x = origin_axis;
            d.x = temp_x;
            origin_axis = temp_x;
        }
    }
    
    d3.selectAll(".group_axis")
        .attr("x", function(d){
            return d.x - 22 * (axis_text.indexOf(d) + 1) + 2;
        });

    d3.selectAll(".group_rect")
        .attr("x", function(d){
            //console.log("change")
            return d.x;
        });
}

function dragended_axis(d){
    d.x = origin_axis;
    d3.selectAll(".group_axis")
        .attr("x", function(d){
            return d.x - 22 * (axis_text.indexOf(d) + 1) + 2;
        });
    d3.selectAll(".group_rect")
        .attr("x", function(d){
            //console.log("change")
            return d.x;
        });

    for(var i = 0; i < axis_text.length; i ++){
        if(axis_text[i].last == -1){
            var start = i;
            break;
        }
    }

    for(var i = 0; i < axis_text.length; i++){
        new_group_list[i] = axis_text[start].name;
        start = axis_text[start].next;
    }
}
