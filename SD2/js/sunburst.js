var updraw = 0, downdraw = 0;
var east_height = 600;
var upheight = 2/5. * east_height, downheight = 2/5. * east_height,
    one_hist_width = 20;

var up_sun_g, down_sun_g;

var draw_minimap = 0;

var lock_num = 0;
var align_num = 0;

var upnodes, downnodes;
var up_logo_text = new Array();
var down_logo_text = new Array();

var change_scale_signal = 0;

var yScale, up_mini_yscale, down_mini_yscale;
var scale_method = 0, max_size = 0;

var show_properties = ["# Citations", "H-index", "# Papers"];
var show_group_bys = ["P. Venue Type", "P. CCF Rank", "P. Venue", "P. Year", "P. Citation Count"," —————————— ", "C. Venue Type", "C. CCF Rank", "C. Venue", "C. Year", "C. Citation Count", " —————————— ", "Individual Paper"];

function drawSun(new_id, new_tree){
    var node_num = 0;
    max_size = 0;
    one_hist_width = 20;

    var test_partition = d3.layout.partition()
                .size([650, upheight])
                .value(function() { return 1; })
                .sort(null);

    test_nodes = test_partition.nodes(new_tree);
    for(var i = 0; i < test_nodes.length; i ++){
        if(test_nodes[i].depth == test_nodes[test_nodes.length-1].depth){
            node_num += 1;
            if(test_nodes[i].size > max_size){
                max_size = test_nodes[i].size;
            }
        }
    }

    Show_Sunbursts_all[new_id]['node_num'] = node_num;
    Show_Sunbursts_all[new_id]['tree'] = new_tree;
    Show_Sunbursts_all[new_id]['max_size'] = max_size;

    if(new_id == 'up' && downdraw == 1){
        if(max_size < Show_Sunbursts_all['down']['max_size']){
            max_size = Show_Sunbursts_all['down']['max_size']
        }
        if(node_num < Show_Sunbursts_all['down']['node_num']){
            node_num = Show_Sunbursts_all['down']['node_num']
        }
    }
    else if(new_id == 'down' && updraw == 1){
        if(max_size < Show_Sunbursts_all['up']['max_size']){
            max_size = Show_Sunbursts_all['up']['max_size']
        }
        if(node_num < Show_Sunbursts_all['up']['node_num']){
            node_num = Show_Sunbursts_all['up']['node_num']
        }
    }
    

    if(scale_method % 3 == 0){
        yScale = function(info){
            return (150.0/max_size) * info;
        }

        up_mini_yscale = function(info){
            return (18.0/max_size) * info;
        }

        down_mini_yscale = function(info){
            return (18.0/max_size) * info;
        }
    }
    else if(scale_method % 3 == 1){
        yScale = function(info){
            return 150.0/Math.sqrt(max_size) * Math.sqrt(info);
        }

        up_mini_yscale = function(info){
            return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
        }

        down_mini_yscale = function(info){
            return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
        }
    }
    else{
        //yScale = d3.scale.log()
        //    .domain([0, max_size])
        //    .range([0,150]);

        yScale = function(info){
            a = 150/Math.log(max_size + 1)
            return a * Math.log(info + 1);
        }

        up_mini_yscale = function(info){
            a = 18/Math.log(max_size + 1)
            return a * Math.log(info + 1);
        }

        down_mini_yscale = function(info){
            a = 18/Math.log(max_size + 1)
            return a * Math.log(info + 1);
        }
    }
    
    console.log(max_size)
    if(node_num > 32){
        one_hist_width = 640 / node_num;
    }
    //if(node_num > 32 && node_num <= 53){
    //    one_hist_width = 640 / node_num;
    //}
    //else if(node_num > 53){
    //    one_hist_width = 12;
    //}

    Remove_nodechildren('sunburst_map')

    d3.select("#sunburst_map").append("svg")
                            .attr("id", "show_sunbursts")
                            .attr("width", 770)
                            .attr("height", east_height)
                            .attr("transform", "translate(0,30)");
    
    d3.select("#show_sunbursts").append("rect")
                            .attr("class", "medium_rect")
                            .attr("rx", 5)
                            .attr("ry", 10)
                            .attr("width", 640)
                            .attr("height", 1)
                            .attr("x", 2)
                            .attr("y", 305)
                            .style("fill", "darkgray");

    d3.select("#show_sunbursts").append("rect")
                            .attr("id", "scale_rect")
                            .attr("width", 20)
                            .attr("height", 20)
                            .attr("x", 735)
                            .attr("y", 255)
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .style("fill", function(){
                                if(scale_method % 3 == 0){
                                    return "url(#LinearPattern)";
                                }
                                else if(scale_method % 3 == 1){
                                    return "url(#SqrtPattern)";
                                }
                                else{
                                    return "url(#LogPattern)";
                                }
                            })
                            .style("cursor", "pointer")
                            .style("opacity", 0.5)
                            .on("mouseover", function(){
                                if(scale_method % 3 == 0){
                                    d3.select(this).style("fill", "url(#SqrtPattern)");
                                    add_hints("scale_sqrt");
                                }
                                else if(scale_method % 3 == 1){
                                    d3.select(this).style("fill", "url(#LogPattern)");
                                    add_hints("scale_log");
                                }
                                else{
                                    d3.select(this).style("fill", "url(#LinearPattern)");
                                    add_hints("scale_linear");
                                }

                                d3.select(this)
                                    .style("opacity", 1);
                            })
                            .on("mouseout", function(){
                                if(scale_method % 3 == 0){
                                    d3.select(this).style("fill", "url(#LinearPattern)");
                                }
                                else if(scale_method % 3 == 1){
                                    d3.select(this).style("fill", "url(#SqrtPattern)");
                                }
                                else{
                                    d3.select(this).style("fill", "url(#LogPattern)");
                                }

                                d3.select(this)
                                    .transition()
                                    .duration(100)
                                    .style("opacity", 0.5);
                                remove_hints();
                            })
                            .on("click", function(){
                                remove_hints();
                                change_scale_signal = 1;
                                scale_method += 1;
                                if(scale_method % 3 == 1){
                                    add_hints("scale_log");
                                    d3.select(this).style("fill", "url(#SqrtPattern)");

                                    yScale = function(info){
                                        return 150.0/Math.sqrt(max_size) * Math.sqrt(info);
                                    }

                                    up_mini_yscale = function(info){
                                        return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
                                    }

                                    down_mini_yscale = function(info){
                                        return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
                                    }
                                }
                                else if(scale_method % 3 == 2){
                                    add_hints("scale_linear");
                                    d3.select(this).style("fill", "url(#LogPattern)");
                                    //yScale = d3.scale.log()
                                    //    .domain([0, max_size])
                                    //    .range([0,150]);

                                    yScale = function(info){
                                        a = 150/Math.log(max_size + 1)
                                        return a * Math.log(info + 1);
                                    }

                                    up_mini_yscale = function(info){
                                        a = 18/Math.log(max_size + 1)
                                        return a * Math.log(info + 1);
                                    }

                                    down_mini_yscale = function(info){
                                        a = 18/Math.log(max_size + 1)
                                        return a * Math.log(info + 1);
                                    }
                                }
                                else if(scale_method % 3 == 0){
                                    add_hints("scale_sqrt");
                                    d3.select(this).style("fill", "url(#LinearPattern)");

                                    yScale = function(info){
                                        return (150.0/max_size) * info;
                                    }

                                    up_mini_yscale = function(info){
                                        return (18.0/max_size) * info;
                                    }

                                    down_mini_yscale = function(info){
                                        return (18.0/max_size) * info;
                                    }
                                }
                                if(updraw == 1){
                                    // remove_map('up');
                                    // remove_minimap('up');
                                    // draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], yScale, one_hist_width, 0, 1);
                                    var extent = up_mini_brush.extent();
                                    up_width = 640 / ((extent[1] - extent[0]) / one_hist_width);
                                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['up']['node_num'] * up_width;
                                    if(downdraw == 1){
                                        if(Show_Sunbursts_all['down']['node_num'] > Show_Sunbursts_all['up']['node_num']){
                                            x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['down']['node_num'] * up_width;
                                        }
                                        if(Show_Sunbursts_all['down']['node_num'] < 32 && Show_Sunbursts_all['up']['node_num'] < 32){
                                            x_offset = (extent[1]+extent[0])/2/640*32 * up_width;
                                        }
                                    }
                                    else if(Show_Sunbursts_all['up']['node_num'] < 32){
                                        x_offset = (extent[1]+extent[0])/2/640*32 * up_width;
                                    } 
                                    remove_map('up');
                                    remove_minimap('up')
                                    draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], up_width, x_offset, 1);

                                    var nodes = document.getElementById("up_minimap").childNodes;

                                    for(var i = 0; i<nodes.length; i++){
                                        if(nodes[i].tagName == 'rect'){
                                            if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                                d3.select(nodes[i]).style("opacity", 1);
                                            }
                                            else{
                                                d3.select(nodes[i]).style("opacity", 0.3);
                                            }
                                        }
                                    }
                                }
                                if(downdraw == 1){
                                    // remove_map('down');
                                    // remove_minimap('down');
                                    // draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], yScale, one_hist_width, 0, 1);
                                    var extent = down_mini_brush.extent();
                                    down_width = 640 / ((extent[1] - extent[0]) / one_hist_width);
                                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['down']['node_num'] * down_width;
                                    if(updraw == 1){
                                        if(Show_Sunbursts_all['up']['node_num'] > Show_Sunbursts_all['down']['node_num']){
                                            x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['up']['node_num'] * down_width;
                                        }
                                        if(Show_Sunbursts_all['up']['node_num'] < 32 && Show_Sunbursts_all['down']['node_num'] < 32){
                                            x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                                        }
                                    }
                                    else if(Show_Sunbursts_all['down']['node_num'] < 32){
                                        x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                                    }
                                    remove_map('down');
                                    remove_minimap('down');
                                    draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], down_width, x_offset, 1);

                                    var nodes = document.getElementById("down_minimap").childNodes;

                                    for(var i = 0; i<nodes.length; i++){
                                        if(nodes[i].tagName == 'rect'){
                                            if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                                d3.select(nodes[i]).style("opacity", 1);
                                            }
                                            else{
                                                d3.select(nodes[i]).style("opacity", 0.3);
                                            }
                                        }
                                    }
                                }
                                change_scale_signal = 0;
                            });

    d3.select("#show_sunbursts").append("rect")
                            .attr("id", "lock_rect")
                            .attr("width", 20)
                            .attr("height", 20)
                            .attr("x", 735)
                            .attr("y", 295)
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .style("fill", function(){
                                if(lock_num%2 == 0){
                                    return "url(#LockPattern)";
                                }
                                else{
                                    return "url(#UnlockPattern)";
                                }
                            })
                            .style("cursor", "pointer")
                            .style("opacity", 0.5)
                            .on("mouseover", function(){
                                d3.select(this)
                                    .style("opacity", 1);
                                if(lock_num %2 == 1){
                                    add_hints("lock");
                                }
                                else{
                                    add_hints("unlock");
                                }
                                
                            })
                            .on("mouseout", function(){
                                d3.select(this)
                                    .transition()
                                    .duration(100)
                                    .style("opacity", 0.5);
                                remove_hints();
                            })
                            .on("click", function(){
                                remove_hints();
                                lock_num += 1;
                                if(lock_num%2 == 0){
                                    add_hints("unlock");
                                    SUNLOCK = 1;
                                    d3.select(document.getElementById("lock_rect")).style("fill", "url(#LockPattern)");
                                    d3.select(document.getElementById("align_rect")).style("fill", "url(#CompactPattern)");
                                }
                                else{
                                    add_hints("lock");
                                    SUNLOCK = 0;
                                    d3.select(document.getElementById("lock_rect")).style("fill", "url(#UnlockPattern)")
                                    align_num = 0;
                                    d3.select(document.getElementById("align_rect")).style("fill", "url(#CompactPattern_unlock)")
                                    if(updraw == 1 && downdraw == 1){
                                        var number = 5;
                                        (function() {
                                            //var test = "http://98.220.5.15:1234/user";
                                            var test = "http://140.82.48.134:1234/user";
                                            $.getJSON( test, {
                                                num : number,
                                                list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                                                property: Show_Sunbursts_all['up']['show_property'],
                                                group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                                                group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists'])
                                            })
                                            .done(function( data ) {
                                                if(data['num'] == '0'){
                                                    updraw = 0;
                                                    drawSun('up', data['tree']);
                                                }
                                            });
                                        })();
                                        
                                        (function(){
                                            var test = "http://140.82.48.134:1234/user";
                                            $.getJSON( test, {
                                                num: number,
                                                list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                                                property: Show_Sunbursts_all['down']['show_property'],
                                                group_by: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                                                group_lists: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                                            })
                                            .done(function( data ) {
                                                if(data['num'] == '0'){
                                                    downdraw = 0;
                                                    drawSun('down', data['tree']);
                                                }
                                            });
                                        })();
                                    }
                                }
                            });

    d3.select("#show_sunbursts").append("rect")
                            .attr("id", "align_rect")
                            .attr("width", 20)
                            .attr("height", 20)
                            .attr("x", 735)
                            .attr("y", 335)
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .style("fill", function(){
                                if(lock_num % 2 == 0){
                                    if(align_num%2 == 0){
                                        return "url(#CompactPattern)";
                                    }
                                    else{
                                        return "url(#AlignedPattern)";
                                    }
                                }
                                else{
                                    return "url(#CompactPattern_unlock)";
                                }
                            })
                            // .style("cursor", "pointer")
                            .style("opacity", 0.5)
                            .on("mouseover", function(){
                                if(lock_num % 2 == 0){
                                    d3.select(this)
                                    .style("opacity", 1)
                                    .style("cursor", "pointer");

                                    if(align_num % 2 == 0){
                                        add_hints("aligned");
                                    }
                                    else{
                                        add_hints("compact");
                                    }
                                }
                            })
                            .on("mouseout", function(){
                                if(lock_num % 2== 0){
                                    d3.select(this)
                                    .transition()
                                    .duration(100)
                                    .style("opacity", 0.5);
                                    remove_hints();
                                }
                            })
                            .on("click", function(){
                                remove_hints();
                                if(lock_num %2 == 0){
                                    align_num += 1;
                                    if(align_num%2 == 1){
                                        // add_hints("compact");
                                        d3.select(document.getElementById("align_rect")).style("fill", "url(#AlignedPattern)")
                                        if(updraw == 1 && downdraw == 1){
                                            var number = 10;
                                            (function() {
                                                //var test = "http://98.220.5.15:1234/user";
                                                var test = "http://140.82.48.134:1234/user";
                                                $.getJSON( test, {
                                                    num : number,
                                                    list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                                                    property: Show_Sunbursts_all['up']['show_property'],
                                                    group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                                                    group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists']),
                                                    list_down: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                                                    property_down: Show_Sunbursts_all['down']['show_property'],
                                                    group_by_down: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                                                    group_lists_down: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                                                })
                                                .done(function( data ) {
                                                    if(data['num'] == '0'){
                                                        updraw = 0;
                                                        
                                                        drawSun('up', data['up_tree']);
                                                        downdraw = 0;
                                                        
                                                        drawSun('down', data['down_tree']);

                                                        remove_map('up');
                                                        remove_minimap('up');
                                                        draw_up_sunburst('up', data['up_tree'], one_hist_width, 0, 1);

                                                        var parent = document.getElementById("up_text_info")
                                                        var childrens = parent.childNodes;
                                                        this_child = childrens[1]
                                                        d3.select(this_child).style("color", up_down_colorlist["up"]);

                                                        d3.select(parent).append("text")
                                                        .text(" VS ")
                                                        .style("font-family", "Arial")
                                                        .style("font-size", 20)
                                                        .style("color", Unclickable_name_color);

                                                        d3.select(parent).append("text")
                                                        .text(function(){
                                                            return Show_Sunbursts_all['down']['title_text_info'];
                                                        })
                                                        .style("font-family", "Arial")
                                                        .style("font-size", 20)
                                                        .style("color", up_down_colorlist["down"]);
                                                        
                                                        remove_map('down');
                                                        remove_minimap('down');
                                                        Remove_nodechildren('downsunburst')
                                                        Remove_nodechildren('down_logo')
                                                        // draw_down_sunburst('down', data['down_tree'], one_hist_width, 0, 1);  #revised 210906

                                                        //raw_compare_line(yScale);
                                                        //draw_compare_double_line(yScale);
                                                        //draw_compare_hist(yScale);
                                                        //draw_compare_double_hist(yScale)
                                                    }
                                                });
                                            })(); 
                                        }
                                    }
                                    else{
                                        // add_hints("aligned")
                                        d3.select(document.getElementById("align_rect")).style("fill", "url(#CompactPattern)")
                                        if(updraw == 1 && downdraw == 1){
                                            var number = 5;
                                            (function() {
                                                //var test = "http://98.220.5.15:1234/user";
                                                var test = "http://140.82.48.134:1234/user";
                                                $.getJSON( test, {
                                                    num : number,
                                                    list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                                                    property: Show_Sunbursts_all['up']['show_property'],
                                                    group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                                                    group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists'])
                                                })
                                                .done(function( data ) {
                                                    if(data['num'] == '0'){
                                                        updraw = 0;
                                                        drawSun('up', data['tree']);
                                                    }
                                                });
                                            })();
                                            
                                            (function(){
                                                var test = "http://140.82.48.134:1234/user";
                                                $.getJSON( test, {
                                                    num: number,
                                                    list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                                                    property: Show_Sunbursts_all['down']['show_property'],
                                                    group_by: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                                                    group_lists: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                                                })
                                                .done(function( data ) {
                                                    if(data['num'] == '0'){
                                                        downdraw = 0;
                                                        drawSun('down', data['tree']);
                                                    }
                                                });
                                            })();
                                        }
                                    }
                                }
                            });
    
    d3.select("#show_sunbursts").append("svg")
                            .attr("id", "sunbursts")
                            .attr("width", 640)
                            .attr("height", east_height);

    for(var uid in Show_Sunbursts_all){
        data = Show_Sunbursts_all[uid]['tree'];
        if(uid == 'up'){
            draw_up_sun(uid, data);
        }
        else{
            draw_down_sun(uid, data);
        }
        // if(uid != new_id){
        //     data = Show_Sunbursts_all[uid]['tree'];
        //     if(updraw == 1){
        //         draw_up_sun(uid, data, yScale);
        //     }
        //     else if(downdraw == 1){
        //         draw_down_sun(uid, data, yScale);
        //     }
        // }
        // else{
        //     if(updraw == 0){
        //         draw_up_sun(new_id, new_tree, yScale);
        //     }
        //     else if(downdraw == 0){        
        //         draw_down_sun(new_id, new_tree, yScale);
        //     }
        // }   
    }
    console.log(Show_Sunbursts_all)

}

function draw_compare_line(yScale){
    var up_compare_lines = d3.select("#sunbursts").append("g")
                    .attr("id", "up_compare_lines")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    up_compare_lines.selectAll(".line")
    .data(upnodes)
    .enter()
    .append("line")
    .attr("class", "up_compare_line")
    .attr("x1", function(d,i){
        return d.x;
    })
    .attr("y1", function(d,i){
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
            }
        }
        return d.y;
    })
    .attr("x2", function(d,i){
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                return d.x + d.dx;
            }
        }
        return d.x;
    })
    .attr("y2", function(d, i){
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
            }
        }
        return d.y; 
    })
    .attr("stroke", "orange")
    .attr("stroke-width", 1);

    var down_compare_lines = d3.select("#sunbursts").append("g")
                    .attr("id", "down_compare_lines")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    down_compare_lines.selectAll(".line")
    .data(downnodes)
    .enter()
    .append("line")
    .attr("class", "down_compare_line")
    .attr("x1", function(d,i){
        return d.x;
    })
    .attr("y1", function(d,i){
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size > upnodes[i].size){
                d.y = 310 + 30 * (d.depth - 1) + yScale(upnodes[i].size);
            }
        }
        return d.y;
    })
    .attr("x2", function(d,i){
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size > upnodes[i].size){
                return d.x + d.dx;
            }
        }
        return d.x;
    })
    .attr("y2", function(d, i){
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size > upnodes[i].size){
                d.y = 310 + 30 * (d.depth - 1) + yScale(upnodes[i].size);
            }
        }
        return d.y; 
    })
    .attr("stroke", "orange")
    .attr("stroke-width", 1);
}

function draw_compare_double_line(yScale){
    var up_compare_lines = d3.select("#sunbursts").append("g")
                    .attr("id", "up_compare_lines")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    up_compare_lines.selectAll(".line")
    .data(upnodes)
    .enter()
    .append("line")
    .attr("class", "up_compare_line")
    .attr("x1", function(d,i){
        return d.x;
    })
    .attr("y1", function(d,i){
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size != downnodes[i].size){
                d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
            }
        }
        return d.y;
    })
    .attr("x2", function(d,i){
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size != downnodes[i].size){
                return d.x + d.dx;
            }
        }
        return d.x;
    })
    .attr("y2", function(d, i){
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size != downnodes[i].size){
                d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
            }
        }
        return d.y; 
    })
    .attr("stroke", function(d, i){
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                return "green";
            }
            else if(d.size < downnodes[i].size){
                return "red";
            }
        }
    })
    .attr("stroke-width", 1);

    var down_compare_lines = d3.select("#sunbursts").append("g")
                    .attr("id", "down_compare_lines")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    down_compare_lines.selectAll(".line")
    .data(downnodes)
    .enter()
    .append("line")
    .attr("class", "down_compare_line")
    .attr("x1", function(d,i){
        return d.x;
    })
    .attr("y1", function(d,i){
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size != upnodes[i].size){
                d.y = 310 + 30 * (d.depth - 1) + yScale(upnodes[i].size);
            }
        }
        return d.y;
    })
    .attr("x2", function(d,i){
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size != upnodes[i].size){
                return d.x + d.dx;
            }
        }
        return d.x;
    })
    .attr("y2", function(d, i){
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size != upnodes[i].size){
                d.y = 310 + 30 * (d.depth - 1) + yScale(upnodes[i].size);
            }
        }
        return d.y; 
    })
    .attr("stroke", function(d, i){
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size > upnodes[i].size){
                return "green";
            }
            else if(d.size< upnodes[i].size){
                return "red";
            }
        }
    })
    .attr("stroke-width", 1);
}

function draw_compare_hist(yScale){
    var up_compare_bars = d3.select("#sunbursts").append("g")
                    .attr("id", "up_compare_bars")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    up_compare_bars.selectAll(".bar")
    .data(upnodes)
    .enter()
    .append("rect")
    .attr("class", "up_compare_bar")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d, i) {
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
                if(downnodes[i].size == 0){
                    d.y= 300 - 30 * (upnodes[upnodes.length-1].depth -1) - 2
                }
            }
        }
        return d.y;
    })
    .attr("width", function(d) { return d.dx; })
    .attr("height", function(d,i) {
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                d.dy = yScale(downnodes[i].size)
                if(downnodes[i].size == 0){
                    d.dy = 2
                }
            }
            else{
                d.dy = 0;
            }
        }
        else{
            d.dy = 0;
        }
        return d.dy;
    })
    .style("fill", "red")
    .style("stroke", "white");

    var down_compare_bars = d3.select("#sunbursts").append("g")
                    .attr("id", "down_compare_bars")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    down_compare_bars.selectAll(".bars")
    .data(downnodes)
    .enter()
    .append("rect")
    .attr("class", "down_compare_bar")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) {
        if(d.depth == 0){
            d.y = 310;
        }
        else{
            d.y = 310 + 30 * (d.depth - 1);
        }
        return d.y;
    })
    .attr("width", function(d) { return d.dx; })
    .attr("height", function(d,i) {
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size > upnodes[i].size){
                d.dy = yScale(upnodes[i].size);
                if(upnodes[i].size == 0){
                    d.dy = 2;
                }
            }
            else{
                d.dy = 0;
            }
        }
        else{
            d.dy = 0;
        }
        return d.dy;
    })
    .style("fill", d3.rgb(0,0,0,0))
    .style("stroke", "black");

    up_sun_g.selectAll(".labels")
        .data(upnodes.filter(function(d,i) { 
            //return (d.dx > 6 && i && (d.size == undefined)); }))
            return (i); }))
        .enter().append("text")
        .attr("class", "labels")
        .style("font-size", 10)
        .style("font-family", "Arial")
        .style("text-anchor", function(d){
            if(typeof(d.size) == "undefined"){
                return "middle";
            }
            return "end";
        })
        .attr("transform", function(d) { 
            //console.log(d.size)
            if(typeof(d.size) == "undefined"){
                if(Show_Sunbursts_all['up']['group_lists'].hasOwnProperty(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth]) && d.depth != Show_Sunbursts_all['up']['show_group_by'].length){
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] != "P. Venue" && Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] != "C. Venue"){
                        return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+5) + ")"; 
                    }
                }
                return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2+15) + ")rotate(90)";
            }
            else{
                return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy-5) + ")rotate(90)"; 
            }
        })
        .text(function(d) {
            if(d.depth == Show_Sunbursts_all['up']['show_group_by'].length && Show_Sunbursts_all['up']['show_group_by'][0] == "Individual Paper"){
                return '';
            }
            else if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "Individual Paper"){
                return d.name.substring(0,5) + '...';
            }
            else{
                if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){
                    if(d.name.indexOf('~') != -1){
                        return d.name.substring(0, d.name.indexOf('~'));
                    }
                }
                return d.name;
            }
        })
        .style("opacity", function(d){
            if(d.dx <= 9){
                return 0;
            }
            else{
                return 1;
            }
        });
    down_sun_g.selectAll(".labels")
        .data(downnodes.filter(function(d,i) { 
            //return (d.dx > 6 && i && (d.size == undefined)); }))
            return (i); }))
        .enter().append("text")
        .attr("class", "labels")
        .style("font-size", 10)
        .style("font-family", "Arial")
        .style("text-anchor", function(d){
            if(typeof(d.size) == "undefined"){
                return "middle";
            }
            return "start";
        })
        .attr("transform", function(d) { 
            //console.log(d.size)
            if(typeof(d.size) == "undefined"){
                if(Show_Sunbursts_all['down']['group_lists'].hasOwnProperty(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length-d.depth])){
                    if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] != "P. Venue" && Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] != "C. Venue"){
                        return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+5) + ")"; 
                    }
                }
                return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2 + 15) + ")rotate(90)";
            }
            else{
                return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + 5) + ")rotate(90)"; 
            }
        })
        .text(function(d) {
            if(d.depth == Show_Sunbursts_all['down']['show_group_by'].length && Show_Sunbursts_all['down']['show_group_by'][0] == "Individual Paper"){
                return '';
            }
            else if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "Individual Paper"){
                return d.name.substring(0,5) + '...';
            }
            else{
                if(Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['down']['show_group_by'][Show_Sunbursts_all['down']['show_group_by'].length - d.depth] == "C. Venue"){
                    if(d.name.indexOf('~') != -1){
                        return d.name.substring(0, d.name.indexOf('~'));
                    }
                }
                return d.name;
            }
        })
        .style("opacity", function(d){
            if(d.dx <= 9){
                return 0;
            }
            else{
                return 1;
            }
        });
}

function draw_compare_double_hist(yScale){
    var up_compare_bars = d3.select("#sunbursts").append("g")
                    .attr("id", "up_compare_bars")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    up_compare_bars.selectAll(".bar")
    .data(upnodes)
    .enter()
    .append("rect")
    .attr("class", "up_compare_bar")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d, i) {
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
                if(downnodes[i].size == 0){
                    d.y= 300 - 30 * (upnodes[upnodes.length-1].depth -1) - 1
                }
            }
        }
        return d.y;
    })
    .attr("width", function(d) { return d.dx; })
    .attr("height", function(d,i) {
        if(d.depth == upnodes[upnodes.length-1].depth){
            if(d.size > downnodes[i].size){
                d.dy = yScale(downnodes[i].size)
                if(downnodes[i].size == 0){
                    d.dy = 1
                }
            }
            else{
                d.dy = 0;
            }
        }
        else{
            d.dy = 0;
        }
        return d.dy;
    })
    .style("fill", "orange");

    var down_compare_bars = d3.select("#sunbursts").append("g")
                    .attr("id", "down_compare_bars")
                    .attr("transform", function(){
                        return "translate(0,0)";
                    });

    down_compare_bars.selectAll(".bars")
    .data(downnodes)
    .enter()
    .append("rect")
    .attr("class", "down_compare_bar")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) {
        if(d.depth == 0){
            d.y = 310;
        }
        else{
            d.y = 310 + 30 * (d.depth - 1);
        }
        return d.y;
    })
    .attr("width", function(d) { return d.dx; })
    .attr("height", function(d,i) {
        if(d.depth == downnodes[downnodes.length-1].depth){
            if(d.size > upnodes[i].size){
                d.dy = yScale(upnodes[i].size);
                if(upnodes[i].size == 0){
                    d.dy = 1;
                }
            }
            else{
                d.dy = 0;
            }
        }
        else{
            d.dy = 0;
        }
        return d.dy;
    })
    .style("fill", "orange");
}

function drag_slider(turn, value){
    turn = "#" + turn + "_sunburst";
    d3.select(turn)
        .attr("transform", function(){
            return "translate(" + value + ",0)";
        });
}

function removeSunburst(uid, remove_by_hist){

    if(remove_by_hist == 0){
        var year_list = new Array();
        for(var i = minimum_year; i <= maximum_year; i++){
            year_list.push(i);
        }
        
        Remove_nodechildren("gRows");

        //defineCirclePatterns(bodySVG_g, 16);
        for(var id in histogram_list){
            redraw_Graph(id, year_list);
        }
    }

    Remove_nodechildren('sunburst_map')
    if(updraw != 0 || downdraw != 0){
        d3.select("#sunburst_map").append("svg")
                                .attr("id", "show_sunbursts")
                                .attr("width", 770)
                                .attr("height", east_height)
                                .attr("transform", "translate(0,30)");

        d3.select("#show_sunbursts").append("rect")
                                .attr("class", "medium_rect")
                                .attr("rx", 5)
                                .attr("ry", 10)
                                .attr("width", 640)
                                .attr("height", 1)
                                .attr("x", 2)
                                .attr("y", 305)
                                .style("fill", "darkgray");

        d3.select("#show_sunbursts").append("rect")
                                .attr("id", "lock_rect")
                                .attr("width", 20)
                                .attr("height", 20)
                                .attr("x", 735)
                                .attr("y", 295)
                                .attr("rx", 5)
                                .attr("ry", 5)
                                .style("opacity", 0.5)
                                .style("fill", function(){
                                    if(lock_num%2 == 0){
                                        return "url(#LockPattern)";
                                    }
                                    else{
                                        return "url(#UnlockPattern)";
                                    }
                                })
                                .style("cursor", "pointer")
                                .on("mouseover", function(){
                                    d3.select(this)
                                        .style("opacity", 1);
                                    if(lock_num %2 == 1){
                                        add_hints("lock");
                                    }
                                    else{
                                        add_hints("unlock");
                                    }
                                    
                                })
                                .on("mouseout", function(){
                                    d3.select(this)
                                        .transition()
                                        .duration(100)
                                        .style("opacity", 0.5);
                                    remove_hints();
                                })
                                .on("click", function(){
                                    remove_hints();
                                    lock_num += 1;
                                    if(lock_num%2 == 0){
                                        add_hints("unlock");
                                        SUNLOCK = 1;
                                        d3.select(document.getElementById("lock_rect")).style("fill", "url(#LockPattern)");
                                        d3.select(document.getElementById("align_rect")).style("fill", "url(#CompactPattern)");
                                    }
                                    else{
                                        add_hints("lock");
                                        SUNLOCK = 0;
                                        d3.select(document.getElementById("lock_rect")).style("fill", "url(#UnlockPattern)")
                                        align_num = 0;
                                        d3.select(document.getElementById("align_rect")).style("fill", "url(#CompactPattern_unlock)")
                                    }
                                });
            
        d3.select("#show_sunbursts").append("svg")
                                .attr("id", "sunbursts")
                                .attr("width", 640)
                                .attr("height", east_height);

        for(var uid in Show_Sunbursts_all){
            if(Show_Sunbursts_all[uid]['node_num'] > 32){
                one_hist_width = 640 / Show_Sunbursts_all[uid]['node_num'];
            }
            else{
                one_hist_width = 20;
            }

            if(scale_method % 3 == 0){
                yScale = function(info){
                    return (150.0/Show_Sunbursts_all[uid]['max_size']) * info;
                }

                up_mini_yscale = function(info){
                    return (18.0/Show_Sunbursts_all[uid]['max_size']) * info;
                }

                down_mini_yscale = function(info){
                    return (18.0/Show_Sunbursts_all[uid]['max_size']) * info;
                }
            }
            else if(scale_method % 3 == 1){
                yScale = function(info){
                    return 150.0/Math.sqrt(Show_Sunbursts_all[uid]['max_size']) * Math.sqrt(info);
                }

                up_mini_yscale = function(info){
                    return 18.0/Math.sqrt(Show_Sunbursts_all[uid]['max_size']) * Math.sqrt(info);
                }

                down_mini_yscale = function(info){
                    return 18.0/Math.sqrt(Show_Sunbursts_all[uid]['max_size']) * Math.sqrt(info);
                }
            }
            else{
                //yScale = d3.scale.log()
                //    .domain([0, Show_Sunbursts_all[uid]['max_size']])
                //    .range([0,150]);

                yScale = function(info){
                    a = 150/Math.log(Show_Sunbursts_all[uid]['max_size'] + 1)
                    return a * Math.log(info + 1);
                }

                up_mini_yscale = function(info){
                    a = 18/Math.log(Show_Sunbursts_all[uid]['max_size'] + 1)
                    return a * Math.log(info + 1);
                }

                down_mini_yscale = function(info){
                    a = 18/Math.log(Show_Sunbursts_all[uid]['max_size'] + 1)
                    return a * Math.log(info + 1);
                }
            }

        d3.select("#show_sunbursts").append("rect")
            .attr("id", "scale_rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", 735)
            .attr("y", 255)
            .attr("rx", 5)
            .attr("ry", 5)
            .style("fill", function(){
                if(scale_method % 3 == 0){
                    return "url(#LinearPattern)";
                }
                else if(scale_method % 3 == 1){
                    return "url(#SqrtPattern)";
                }
                else{
                    return "url(#LogPattern)";
                }
            })
            .style("cursor", "pointer")
            .style("opacity", 0.5)
            .on("mouseover", function(){
                if(scale_method % 3 == 0){
                    d3.select(this).style("fill", "url(#SqrtPattern)");
                    add_hints("scale_sqrt");
                }
                else if(scale_method % 3 == 1){
                    d3.select(this).style("fill", "url(#LogPattern)");
                    add_hints("scale_log");
                }
                else{
                    d3.select(this).style("fill", "url(#LinearPattern)");
                    add_hints("scale_linear");
                }

                d3.select(this)
                    .style("opacity", 1);
            })
            .on("mouseout", function(){
                if(scale_method % 3 == 0){
                    d3.select(this).style("fill", "url(#LinearPattern)");
                }
                else if(scale_method % 3 == 1){
                    d3.select(this).style("fill", "url(#SqrtPattern)");
                }
                else{
                    d3.select(this).style("fill", "url(#LogPattern)");
                }

                d3.select(this)
                    .transition()
                    .duration(100)
                    .style("opacity", 0.5);
                remove_hints();
            })
            .on("click", function(){
                remove_hints();
                scale_method += 1;
                if(scale_method % 3 == 1){
                    add_hints("scale_log");
                    d3.select(this).style("fill", "url(#SqrtPattern)");

                    yScale = function(info){
                        return 150.0/Math.sqrt(max_size) * Math.sqrt(info);
                    }

                    up_mini_yscale = function(info){
                        return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
                    }

                    down_mini_yscale = function(info){
                        return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
                    }
                }
                else if(scale_method % 3 == 2){
                    add_hints("scale_linear");
                    d3.select(this).style("fill", "url(#LogPattern)");
                    //yScale = d3.scale.log()
                    //    .domain([0, max_size])
                    //    .range([0,150]);

                    yScale = function(info){
                        a = 150/Math.log(max_size + 1)
                        return a * Math.log(info + 1);
                    }

                    up_mini_yscale = function(info){
                        a = 18/Math.log(max_size + 1)
                        return a * Math.log(info + 1);
                    }

                    down_mini_yscale = function(info){
                        a = 18/Math.log(max_size + 1)
                        return a * Math.log(info + 1);
                    }
                }
                else if(scale_method % 3 == 0){
                    add_hints("scale_sqrt");
                    d3.select(this).style("fill", "url(#LinearPattern)");

                    yScale = function(info){
                        return (150.0/max_size) * info;
                    }

                    up_mini_yscale = function(info){
                        return (18.0/max_size) * info;
                    }

                    down_mini_yscale = function(info){
                        return (18.0/max_size) * info;
                    }
                }
                if(updraw == 1){
                    // remove_map('up');
                    // remove_minimap('up');
                    // draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], yScale, one_hist_width, 0, 1);
                    var extent = up_mini_brush.extent();
                    up_width = 640 / ((extent[1] - extent[0]) / one_hist_width);
                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['up']['node_num'] * up_width;
                    if(downdraw == 1){
                        if(Show_Sunbursts_all['down']['node_num'] > Show_Sunbursts_all['up']['node_num']){
                            x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['down']['node_num'] * up_width;
                        }
                        if(Show_Sunbursts_all['down']['node_num'] < 32 && Show_Sunbursts_all['up']['node_num'] < 32){
                            x_offset = (extent[1]+extent[0])/2/640*32 * up_width;
                        }
                    }
                    else if(Show_Sunbursts_all['up']['node_num'] < 32){
                        x_offset = (extent[1]+extent[0])/2/640*32 * up_width;
                    } 
                    remove_map('up');
                    remove_minimap('up')
                    draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], up_width, x_offset, 1);

                    var nodes = document.getElementById("up_minimap").childNodes;

                    for(var i = 0; i<nodes.length; i++){
                        if(nodes[i].tagName == 'rect'){
                            if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                d3.select(nodes[i]).style("opacity", 1);
                            }
                            else{
                                d3.select(nodes[i]).style("opacity", 0.3);
                            }
                        }
                    }
                }
                if(downdraw == 1){
                    // remove_map('down');
                    // remove_minimap('down');
                    // draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], yScale, one_hist_width, 0, 1);
                    var extent = down_mini_brush.extent();
                    down_width = 640 / ((extent[1] - extent[0]) / one_hist_width);
                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['down']['node_num'] * down_width;
                    if(updraw == 1){
                        if(Show_Sunbursts_all['up']['node_num'] > Show_Sunbursts_all['down']['node_num']){
                            x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all['up']['node_num'] * down_width;
                        }
                        if(Show_Sunbursts_all['up']['node_num'] < 32 && Show_Sunbursts_all['down']['node_num'] < 32){
                            x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                        }
                    }
                    else if(Show_Sunbursts_all['down']['node_num'] < 32){
                        x_offset = (extent[1]+extent[0])/2/640*32 * down_width;
                    }
                    remove_map('down');
                    remove_minimap('down');
                    draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], down_width, x_offset, 1);

                    var nodes = document.getElementById("down_minimap").childNodes;

                    for(var i = 0; i<nodes.length; i++){
                        if(nodes[i].tagName == 'rect'){
                            if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                                d3.select(nodes[i]).style("opacity", 1);
                            }
                            else{
                                d3.select(nodes[i]).style("opacity", 0.3);
                            }
                        }
                    }
                }
            });

            d3.select("#show_sunbursts").append("rect")
                .attr("id", "align_rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", 735)
                .attr("y", 335)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", function(){
                    return "url(#CompactPattern)";
                })
                .style("opacity", 0.5)
                .style("fill", function(){
                    if(lock_num % 2 == 0){
                        if(align_num%2 == 0){
                            return "url(#CompactPattern)";
                        }
                        else{
                            return "url(#AlignedPattern)";
                        }
                    }
                    else{
                        return "url(#CompactPattern_unlock)";
                    }
                })
                // .style("cursor", "pointer")
                .style("opacity", 0.5)
                .on("mouseover", function(){
                    if(lock_num % 2 == 0){
                        d3.select(this)
                        .style("opacity", 1)
                        .style("cursor", "pointer");

                        if(align_num % 2 == 0){
                            add_hints("aligned");
                        }
                        else{
                            add_hints("compact");
                        }
                    }
                })
                .on("mouseout", function(){
                    if(lock_num % 2== 0){
                        d3.select(this)
                        .transition()
                        .duration(100)
                        .style("opacity", 0.5);
                        remove_hints();
                    }
                })
                .on("click", function(){
                    remove_hints();
                    if(lock_num %2 == 0){
                        align_num += 1;
                        if(align_num%2 == 1){
                            add_hints("compact");
                            d3.select(document.getElementById("align_rect")).style("fill", "url(#AlignedPattern)");
                        }
                        else{
                            add_hints("aligned")
                            d3.select(document.getElementById("align_rect")).style("fill", "url(#CompactPattern)");
                        }
                    }
                });
                
    
            data = Show_Sunbursts_all[uid]['tree'];
            if(updraw == 1){
                draw_up_sun(uid, data);
            }
            else if(downdraw == 1){
                draw_down_sun(uid, data);
            }
        }

    }
    else{
        lock_num = 0;
        align_num = 0;
        SUNLOCK = 1;
    }
    // var svg_parent = document.getElementById("show_sunbursts"),
    //     svg_children = svg_parent.childNodes;
    
    // for(var i = 0; i < svg_children.length; i++){
    //     if(svg_children[i].id == (turn + "_sunburst")){
    //         svg_parent.removeChild(svg_children[i]);
    //     }
    // }

    // var map_parent = document.getElementById("sunburst_map"),
    //     map_children = map_parent.childNodes;
    
    // for(var i = 0; i < map_children.length; i++){
    //     if(map_children[i].id == (turn + "sunburst")){
    //         map_parent.removeChild(map_children[i]);
    //     }
    // }
} 