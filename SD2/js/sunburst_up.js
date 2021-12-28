function draw_up_sun(uid, data){
    var upsunburst = d3.select("#sunburst_map").append("div").attr("id", "upsunburst");

    //upsunburst.append("input")
    //        .attr("class", "up_slider")
    //        .attr("id", "up_slider")
    //        .attr("type", "range")
    //        .attr("min", 0)
    //        .attr("max", 640)
    //        .attr("value", 0)
    //        .attr("step", 1);
    
    //document.getElementById("up_slider").oninput = function(){
    //    drag_slider("up", this.value);
    //}

    draw_up_logo();

    draw_up_sunburst(uid, data, one_hist_width, 0, 1);

    var up_title = upsunburst.append("div").attr("class", "up_title");
    var up_title_line = up_title.append("span").attr("id", "up_text_info");

    up_title_line.append("text")
        .text("x ")
        .style("color", Delete_color)
        .style("font-family", "verdana")
        .style("font-size", 20)
        .on("mouseover", function(){
            d3.select(this)
            .style("color", "orange")
            .style("cursor", "pointer");
        })
        .on("mouseout", function(){
            d3.select(this)
            .style("color", Delete_color);
        })
        .on("click", function(){
            updraw = 0;
            var this_id = Show_Sunbursts_all[uid]['left_index']
            histogram_list[this_id]['color'] = Clickable_color;
            var this_year_scale = Object.keys(histogram_list[this_id]['histogram_info']);
            select_part[this_id][0] = this_year_scale[0];
            select_part[this_id][1] = this_year_scale[this_year_scale.length - 1];
            delete Show_Sunbursts_all[uid];
            removeSunburst(uid, 0);
        });

    up_title_line.append("text")
        .text(function(){
            return Show_Sunbursts_all['up']['title_text_info'];
        })
        .style("font-family", "Arial")
        .style("font-size", 20)
        .style("color", Unclickable_name_color);
    updraw = 1;

}

function draw_up_logo(){
    var up_sun_logo = d3.select("#show_sunbursts").append("g")
                    .attr("id", "up_logo")
                    .attr("transform", "translate(645,60)")

        // up_sun_logo.append("text")
        //         .attr("id", "up_scale_methods")
        //         .attr("x", 0)
        //         .attr("y", 40)
        //         .text(function(){
        //             if(scale_method % 3 == 0){
        //                 return "Linear";
        //             }
        //             else if(scale_method % 3 == 1){
        //                 return "Sqrt";
        //             }
        //             else{
        //                 return "Log";
        //             }
        //         })
        //         .style("font-size", 13)
        //         .style("font-family", "Arial")
        //         .style("fill", "steelblue")
        //         .on("mouseover", function(){
        //             if(scale_method % 3 == 0){
        //                 d3.select(this).text("Sqrt").style("fill", "orange");
        //             }
        //             else if(scale_method % 3 == 1){
        //                 d3.select(this).text("Log").style("fill", "orange");
        //             }
        //             else{
        //                 d3.select(this).text("Linear").style("fill", "orange");
        //             }

        //             d3.select(this)
        //             .style("cursor", "pointer");
        //         })
        //         .on("mouseout", function(){
        //             if(scale_method % 3 == 0){
        //                 d3.select(this).text("Linear").style("fill", "steelblue");
        //             }
        //             else if(scale_method % 3 == 1){
        //                 d3.select(this).text("Sqrt").style("fill", "steelblue");
        //             }
        //             else{
        //                 d3.select(this).text("Log").style("fill", "steelblue");
        //             }
        //         })
        //         .on("click", function(){
        //             scale_method += 1;
        //             if(scale_method % 3 == 1){
        //                 d3.select(this).text("Sqrt");
        //                 if(downdraw == 1){
        //                     d3.select("#down_scale_methods").text("Sqrt");
        //                 }

        //                 yScale = function(info){
        //                     return 150.0/Math.sqrt(max_size) * Math.sqrt(info);
        //                 }

        //                 up_mini_yscale = function(info){
        //                     return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
        //                 }

        //                 down_mini_yscale = function(info){
        //                     return 18.0/Math.sqrt(max_size) * Math.sqrt(info);
        //                 }
        //             }
        //             else if(scale_method % 3 == 2){
        //                 d3.select(this).text("Log");
        //                 if(downdraw == 1){
        //                     d3.select("#down_scale_methods").text("Log");
        //                 }

        //                 //yScale = d3.scale.log()
        //                 //    .domain([0, max_size])
        //                 //    .range([0,150]);

        //                 yScale = function(info){
        //                     a = 150/Math.log(max_size + 1)
        //                     return a * Math.log(info + 1);
        //                 }

        //                 up_mini_yscale = function(info){
        //                     a = 18/Math.log(max_size + 1)
        //                     return a * Math.log(info + 1);
        //                 }

        //                 down_mini_yscale = function(info){
        //                     a = 18/Math.log(max_size + 1)
        //                     return a * Math.log(info + 1);
        //                 }
        //             }
        //             else if(scale_method % 3 == 0){
        //                 d3.select(this).text("Linear");
        //                 if(downdraw == 1){
        //                     d3.select("#down_scale_methods").text("Linear");
        //                 }

        //                 yScale = function(info){
        //                     return (150.0/max_size) * info;
        //                 }

        //                 up_mini_yscale = function(info){
        //                     return (18.0/max_size) * info;
        //                 }

        //                 down_mini_yscale = function(info){
        //                     return (18.0/max_size) * info;
        //                 }
        //             }
        //             if(updraw == 1){
        //                 remove_map('up');
        //                 draw_up_sunburst('up', Show_Sunbursts_all['up']['tree'], yScale, one_hist_width, 0, 1);
        //             }
        //             if(downdraw == 1){
        //                 remove_map('down');
        //                 draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], yScale, one_hist_width, 0, 1);
        //             }
        //         });

        
        up_sun_logo.selectAll(".property")
                .data(function(){
                    return [Show_Sunbursts_all['up']['show_property']]
                })
                .enter().append("text")
                .attr("class", "property")
                .attr("x", 0)
                .attr("y", 100-30)
                .text(function(d){
                    return d;
                })
                .style("font-size", 13)
                .style("font-family", "Arial")
                .style("fill", Clickable_name_color)
                .on("mouseover", function(d){
                    add_hints("changeproperty");

                    d3.select(this)
                    .style("fill", "orange")
                    .style("cursor", "pointer");

                    var up_first_choice = d3.select("#up_logo").append("g")
                                            .attr("id", "up_first_choice")
                                            .attr("transform", "translate(0,0)");

                    up_first_choice.append("rect")
                        .attr("width", 90)
                        .attr("height", 50)
                        .attr("x", -90)
                        .attr("y", 90-30)
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .style("fill", "white")
                        .style("stroke", Clickable_name_color)
                        .style("opacity", 0.9)
                        .on("mouseout", function(){
                            var element = document.getElementById("up_first_choice");
                            var el = window.document.body;
                            var judge = 0;
                            window.document.body.onmouseover = function(event){
                            el = event.target;
                            for(var i = 0; i < element.childNodes.length; i ++){
                                if(el == element.childNodes[i]){
                                    judge = 1;
                                }
                            }
                            if(judge == 0 && element.parentNode != null){
                                element.parentNode.removeChild(element);

                                d3.selectAll(".property")
                                .style("fill", Clickable_name_color);
                            }
                            }  
                        });
                    
                    up_first_choice.append("text")
                        .attr("x", -80)
                        .attr("y", 100-30)
                        .text("Change")
                        .style("fill", "orange")
                        .style("font-size", 10)
                        .style("font-family", "Arial");
                    
                    up_first_choice.selectAll(".first_choice_text")
                        .data(function(){
                            var this_data = new Array();
                            for(var i = 0; i<show_properties.length; i++){
                                if(show_properties[i] != Show_Sunbursts_all['up']['show_property']){
                                    this_data.push(show_properties[i]);
                                }
                            }
                            return this_data;
                        })
                        .enter().append("text")
                        .attr("class", "first_choice_text")
                        .attr("x", -80)
                        .attr("y", function(d, i){
                            return 115 + 10 * i-30;
                        })
                        .text(function(d){
                            return d;
                        })
                        .style("font-size", 10)
                        .style("font-family", "Arial")
                        .on("mouseover", function(){
                            d3.select(this)
                            .style("fill", "orange")
                            .style("cursor", "pointer");
                        })
                        .on("mouseout", function(){
                            d3.selectAll(".first_choice_text")
                            .style("fill", "black");
                        })
                        .on("click", function(d){
                            for(var uid in Show_Sunbursts_all){
                                //console.log(uid)
                                Show_Sunbursts_all[uid]['show_property'] = d;
                            }
                            var number = 5;
                            (function() {
                                //var test = "http://98.220.5.15:1234/user";
                                var test = IP_address;
                                $.getJSON( test, {
                                    num : number,
                                    list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                                    property: Show_Sunbursts_all['up']['show_property'],
                                    group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                                    group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists'])
                                })
                                .done(function( data ) {
                                    if(data['num'] == '0'){
                                        align_num = 0;
                                        updraw = 0;
                                        drawSun('up', data['tree']);
                                    }
                                });
                            })(); 
                            console.log(Show_Sunbursts_all.length)
                            if(Object.getOwnPropertyNames(Show_Sunbursts_all).length == 2 && SUNLOCK == 1){
                                (function() {
                                    //var test = "http://98.220.5.15:1234/user";
                                    var test = IP_address;
                                    $.getJSON( test, {
                                        num : number,
                                        list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                                        property: Show_Sunbursts_all['down']['show_property'],
                                        group_by: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                                        group_lists: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                                    })
                                    .done(function( data ) {
                                        if(data['num'] == '0'){
                                            align_num = 0;
                                            downdraw = 0;
                                            drawSun('down', data['tree']);
                                        }
                                    });
                                })(); 
                            }
                            // d3.selectAll(".property")
                            // .text(function(){
                            //     return d;
                            // })
                            // .style("fill", "steelblue");

                            // var element = document.getElementById("up_first_choice");
                            // element.parentNode.removeChild(element);
                        });
                })
                .on("mouseout", function(){
                    remove_hints();
                    var element = document.getElementById("up_first_choice");
                    var el = window.document.body;
                    var judge = 0;
                    window.document.body.onmouseover = function(event){
                      el = event.target;
                      for(var i = 0; i < element.childNodes.length; i ++){
                          if(el == element.childNodes[i]){
                            judge = 1;
                          }
                      }
                      if(judge == 0 && element.parentNode != null){
                        element.parentNode.removeChild(element);

                        d3.selectAll(".property")
                        .style("fill", Clickable_name_color);
                      }
                    }  
                });     

    up_logo_text = [];
    var begin = -1;
    for(var i = 0; i <  Show_Sunbursts_all['up']['show_group_by'].length; i++){
        up_logo_text[i] = new Object();
        up_logo_text[i].num = i;
        up_logo_text[i].x = 0;
        // if(i == 0){
        //     var y = (240 - 60)/2 + 10;
        // }
        up_logo_text[i].last = begin;
        up_logo_text[i].next = i + 1;
        begin = i;
        var y = 225 - 30 * (Show_Sunbursts_all['up']['show_group_by'].length-1-i);
        up_logo_text[i].y = y;
        up_logo_text[i].name = Show_Sunbursts_all['up']['show_group_by'][i];
    }

        up_sun_logo.selectAll(".group_by")
                .data(up_logo_text)
                .enter().append("text")
                .attr("class", "group_by")
                .attr("x", function(d){
                    return d.x;
                })
                .attr("y", function(d){
                    return d.y;
                })
                .style("fill", Clickable_name_color)
                .style("font-size", 12)
                .style("font-family", "Arial")
                .text(function(d){
                    return d.name;
                })
                .on("mouseover", function(data, num){
                    d3.select(this)
                    .style("fill", "orange")
                    .style("cursor", "pointer");

                    add_hints("changeattributes");
                    
                    draw_up_second_change(data, num);
                })
                .on("mouseout", function(){
                    remove_hints();
                    var element = document.getElementById("up_second_choice");
                    var el = window.document.body;
                    var judge = 0;
                    window.document.body.onmouseover = function(event){
                      el = event.target;
                      if(element != null){
                        for(var i = 0; i < element.childNodes.length; i ++){
                            if(el == element.childNodes[i]){
                              judge = 1;
                            }
                        }
                        if(judge == 0 && element.parentNode != null){
                          element.parentNode.removeChild(element);
  
                          d3.selectAll(".group_by")
                          .style("fill", Clickable_name_color);
                        }
                      }
                      else{
                        d3.selectAll(".group_by")
                        .style("fill", Clickable_name_color);
                      }
                    }  
                })
                .call(drag_logo);

        if(Show_Sunbursts_all['up']['show_group_by'].length < 4){
            var rect_y = 225 - 30 * (Show_Sunbursts_all['up']['show_group_by'].length-1) - 40;

            up_sun_logo.append("rect")
                .attr("id", "up_add_group_by")
                .attr("width", 20)
                .attr("height", 20)
                .attr("x", 0)
                .attr("y", rect_y)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", "url(#AndPattern)")//"rgb(161,217,155)")
                .style("opacity", 0.5)
                .style("cursor", "pointer")
                .on("mouseover", function(){
                    d3.select(this)
                        .style("opacity", 1);

                    add_hints("addattributes");
                })
                .on("mouseout", function(){
                    remove_hints();
                    var element = document.getElementById("up_third_choice");
                    var el = window.document.body;
                    var judge = 0;
                    window.document.body.onmouseover = function(event){
                      el = event.target;
                      if(element != null){
                        for(var i = 0; i < element.childNodes.length; i ++){
                            if(el == element.childNodes[i]){
                              judge = 1;
                            }
                        }
                        if(judge == 0 && element.parentNode != null){
                          element.parentNode.removeChild(element);
  
                          d3.select("#up_add_group_by")
                              .transition()
                              .duration(100)
                              .style("opacity", 0.5);
                        }
                      }
                      else{
                        d3.select("#up_add_group_by")
                        .transition()
                        .duration(100)
                        .style("opacity", 0.5);
                      }
                    }  
                })
                .on("click", function(){
                    d3.select(this)
                    .style("opacity", 1);

                    var up_third_choice = d3.select("#up_logo").append("g")
                        .attr("id", "up_third_choice")
                        .attr("transform", "translate(0,0)");
                    up_third_choice.append("rect")
                        .attr("width", 120)
                        .attr("height", 175)
                        .attr("x", -120)
                        .attr("y", function(){
                            return rect_y+10;
                        })
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .style("fill", "white")
                        .style("stroke", Clickable_name_color)
                        .style("opacity", 0.9)
                        .on("mouseout", function(){
                            var element = document.getElementById("up_third_choice");
                            var el = window.document.body;
                            var judge = 0;
                            window.document.body.onmouseover = function(event){
                            el = event.target;
                            for(var i = 0; i < element.childNodes.length; i ++){
                                if(el == element.childNodes[i]){
                                    judge = 1;
                                }
                            }
                            if(judge == 0 && element.parentNode != null){
                                element.parentNode.removeChild(element);
                                d3.select("#up_add_group_by")
                                    .transition()
                                    .duration(100)
                                    .style("opacity", 0.5);
                            }
                            }  
                        });

                    up_third_choice.append("text")
                        .attr("x", -110)
                        .attr("y", rect_y + 20) 
                        .style("fill", "orange")
                        .style("font-size", 10)
                        .style("font-family", "Arial")
                        .text("Add");


                    up_third_choice.selectAll(".third_choice_text")
                    .data(function(){
                        var this_data = new Array();
                        for(var i = 0; i<show_group_bys.length; i++){
                            var this_true = 0;
                            for(var j = 0; j<Show_Sunbursts_all['up']['show_group_by'].length; j++){
                                if(show_group_bys[i] == Show_Sunbursts_all['up']['show_group_by'][j]){
                                    this_true = 1;
                                }
                            }
                            if(this_true == 0){
                                this_data.push(show_group_bys[i]);
                            }
                        }
                        return this_data;
                    })
                    .enter().append("text")
                    .attr("class", "third_choice_text")
                    .attr("x", -110)
                    .attr("y", function(d, i){
                        return rect_y + 33 + 13 * i;
                    })
                    .text(function(d){
                        return d;
                    })
                    .style("fill", function(d){
                        if(d == " —————————— "){
                            return Unclickable_name_color;
                        }
                        return Clickable_name_color;
                        // if(d.substring(0,2) == 'C.'){
                        //     return "#57000d";
                        // }
                        // else{
                        //     return "004529";
                        // }
                    })
                    .style("font-size", 10)
                    .style("font-family", "Arial")
                    .on("mouseover", function(d){
                        if(d != " —————————— "){
                            d3.select(this)
                            .style("fill", "orange")
                            .style("cursor", "pointer");
                        }
                    })
                    .on("mouseout", function(){
                        d3.selectAll(".third_choice_text")
                        .style("fill", function(d){
                            if(d == " —————————— "){
                                return Unclickable_name_color;
                            }
                            return Clickable_name_color;
                            // if(d.substring(0,2) == 'C.'){
                            //     return "#57000d";
                            // }
                            // else{
                            //     return "004529";
                            // }
                        });
                    })
                    .on("click", function(d){
                        if(d != " —————————— "){
                            Show_Sunbursts_all['up']['show_group_by'].push(d);
                            for(var j = Show_Sunbursts_all['up']['show_group_by'].length - 1; j > 0 ; j --){
                                Show_Sunbursts_all['up']['show_group_by'][j] = Show_Sunbursts_all['up']['show_group_by'][j-1];
                            }
                            Show_Sunbursts_all['up']['show_group_by'][0] = d;
                            var number = 5;
                            (function() {
                                //var test = "http://98.220.5.15:1234/user";
                                var test = IP_address;
                                $.getJSON( test, {
                                    num : number,
                                    list: JSON.stringify(Show_Sunbursts_all['up']['paper_list']),
                                    property: Show_Sunbursts_all['up']['show_property'],
                                    group_by: JSON.stringify(Show_Sunbursts_all['up']['show_group_by']),
                                    group_lists: JSON.stringify(Show_Sunbursts_all['up']['group_lists'])
                                })
                                .done(function( data ) {
                                    if(data['num'] == '0'){
                                        align_num = 0;
                                        updraw = 0;
                                        drawSun('up', data['tree']);
                                    }
                                });
                            })(); 

                            if(downdraw == 1 && SUNLOCK == 1){

                                Show_Sunbursts_all['down']['show_group_by'] = Show_Sunbursts_all['up']['show_group_by'].slice();
                                var number = 5;
                                (function() {
                                    //var test = "http://98.220.5.15:1234/user";
                                    var test = IP_address;
                                    $.getJSON( test, {
                                        num : number,
                                        list: JSON.stringify(Show_Sunbursts_all['down']['paper_list']),
                                        property: Show_Sunbursts_all['down']['show_property'],
                                        group_by: JSON.stringify(Show_Sunbursts_all['down']['show_group_by']),
                                        group_lists: JSON.stringify(Show_Sunbursts_all['down']['group_lists'])
                                    })
                                    .done(function( data ) {
                                        if(data['num'] == '0'){
                                            align_num = 0;
                                            downdraw = 0;
                                            drawSun('down', data['tree']);
                                        }
                                    });
                                })(); 
                            }
                        }
                    });
                });

            // up_sun_logo.append("text")
            //     .attr("transform", function(){
            //         return "translate(5," + (rect_y + 14) + ")";
            //     })
            //     .attr("pointer-events", "none")
            //     .style("font-family", "FontAwesome")
            //     .text("+");
        }
}

function calculate_color(this_nodes, nodes){
    if(this_nodes.hasOwnProperty('size')){
        this_nodes.color = this_nodes.size + 1;
    }
    else{
        if(this_nodes.children != []){
            for(var i=0; i<this_nodes.children.length; i++){
                this_nodes.color += calculate_color(nodes[this_nodes.children[i].num], nodes);
            }
        }
    }
    return this_nodes.color;
}

function draw_up_sunburst(uid, data, h_width, x_offset, mini_tag){
    remove_brush(uid);
    up_sun_g = d3.select("#sunbursts").append("g")
                    .attr("id", "up_sunburst")
                    .attr("transform", function(){
                        if(x_offset == 0){
                            return "translate(" + x_offset + ",0)";
                        }
                        else{
                            return "translate(" + (320 - x_offset) + ",0)"; 
                        }
                    });        
    
    var upwidth = Show_Sunbursts_all[uid]['node_num'] * h_width;

    var up_partition = d3.layout.partition()
                .size([upwidth, upheight])
                .value(function() { return 1; })
                .sort(null);

    upnodes = up_partition.nodes(data);

    var last = -1;
    var next = upnodes.length;
    var root = 1;
    for(var i = 0; i < upnodes.length; i++){
        upnodes[i].num = i;
        upnodes[i].color = 0;
        if(upnodes[i].depth == 1){
            upnodes[i].last = last;
            last = i;
            root = i;
        }
        else{
            upnodes[i].root = root;
        }
        var rotate = upnodes.length-1-i;
        if(upnodes[rotate].depth == 1){
            upnodes[rotate].next = next;
            next = rotate;
        }
        upnodes[i].num = i;
        upnodes[i].up = 1;
        if((Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - upnodes[i].depth] == 'P. Venue' ||  Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - upnodes[i].depth] == 'C. Venue') && upnodes[i].name == "~"){
            console.log(upnodes[i].name)
            upnodes[i].name = 'OTHERS';
        }
        // else if((Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - upnodes[i].depth] == 'P. Venue Type' ||  Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - upnodes[i].depth] == 'C. Venue Type') && upnodes[i].name == ""){
        //     upnodes[i].name = '[O]';
        // }
        if((Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - upnodes[i].depth] == 'P. CCF Rank' ||  Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - upnodes[i].depth] == 'C. CCF Rank') && upnodes[i].name == "Other"){
            upnodes[i].name = 'O';
        }
    }

    for(var i = 0; i < upnodes.length; i++){
        if(upnodes[i].depth == 1){
            calculate_color(upnodes[i], upnodes);
        }
    }

    end_info['up'] = root;
    end_info['down'] = -1;

    console.log(upnodes)

    up_sun_g.selectAll(".node")
        .data(upnodes)
        .enter().append("rect")
        .attr("class", "node")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d, i) {
            if(d.depth == upnodes[upnodes.length-1].depth){
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1 & d.size < downnodes[i].size){
                    if(downnodes[i].size > 0){
                        d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
                    }
                    else{
                        d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(0);
                    }    
                }
                else{
                    if(d.size > 0){
                        d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(d.size);
                    }
                    else{
                        d.y = 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(0);
                    }          
                }
            }
            else{
                d.y = 300 - 30 * d.depth;
            }
            return d.y;
        })
        .attr("width", function(d) { return d.dx; })
        .attr("height", function(d,i) {
            if(d.depth == 0){
                d.dy = 0;
            }
            else if(d.depth == upnodes[upnodes.length-1].depth){
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1 & d.size < downnodes[i].size){
                    d.dy = yScale(downnodes[i].size);
                }
                else{
                    if(d.size > 0){
                        d.dy = yScale(d.size);
                    }
                    else{
                        d.dy = yScale(0);
                    }
                }
            }
            else{
                d.dy = 30;
            }
            return d.dy;
        })
        .style("fill", function(d, i){
            if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                if(d.depth != upnodes[upnodes.length-1].depth){
                    return "lightgray";
                }
                else{
                    if(d.size < downnodes[i].size){
                        return up_down_colorlist['down']; 
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                }
            }
            else{
                if(d.color <= 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['up'];
                }
            }
            
        })
        .style("stroke", "white")
        .on("mouseover", function(d,j){
            d3.select(this)
            .style("cursor", "pointer");

            d3.select("#up_sunburst").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(one_rect.depth == upnodes[upnodes.length-1].depth){
                            if(one_rect.size > downnodes[i].size){
                                return up_down_colorlist["up"];
                            }
                            else{
                                return up_down_colorlist["down"];
                            }
                        }
                        else{
                            return "lightgray";
                        }
                    }
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                }
            });

            d3.select("#down_sunburst").selectAll(".node")
            .style("fill", function(one_rect){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                }
            });

            d3.select("#up_minimap").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(one_rect.depth == upnodes[upnodes.length-1].depth){
                            if(one_rect.size > downnodes[i].size){
                                return up_down_colorlist["up"];
                            }
                            else{
                                return up_down_colorlist["down"];
                            }
                        }
                        else{
                            return "lightgray";
                        }
                    }
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                }
            });

            d3.select("#down_minimap").selectAll(".node")
            .style("fill", function(one_rect){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                }
            });

            if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                d3.select("#up_sunburst").selectAll(".bar")
                .style("fill", function(one_rect,i){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                            if(one_rect.depth == upnodes[upnodes.length-1].depth){
                                if(one_rect.size < downnodes[i].size){
                                    return up_down_colorlist["up"];
                                }
                                else{
                                    return up_down_colorlist["down"];
                                }
                            }
                            else{
                                return "lightgray";
                            }
                        }
                    }
                });

                d3.select("#down_sunburst").selectAll(".bar")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                });
            }

            d3.selectAll(".label")
            .style("opacity", function(one_text){
                if(d.name == one_text.name && d.x == one_text.x && d.y == one_text.y){
                    return 1;
                }
                else{
                    if(one_text.dx <= 9){
                        return 0;
                    }
                    else{
                        return 1;
                    }
                }
            });

            d3.select("#up_logo")
            .append("text")
            .attr("id", "up_show_text")
            .attr("x", -640)
            .attr("y", -7)
            .style("font-size", 13)
            .style("font-family", "Arial")
            .style("fill", "orange")
            .text(function(){
                if(d.depth == Show_Sunbursts_all['up']['show_group_by'].length){
                    var size = 0;
                    if(d.size > -1){
                        size = d.size;
                    }
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(downnodes[j].size == undefined){
                            downnodes[j].size = "0"
                        }
                        if(d.name == '[C]'){
                            return 'Conference' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == '[J]'){
                            return 'Journal' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == '[O]'){
                            return 'Others' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'A'){
                            return 'CCF Rank A' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'B'){
                            return 'CCF Rank B' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'C'){
                            return 'CCF Rank C' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'O'){
                            return 'Others' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'OTHERS'){
                            return 'Other Venues' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                    }
                    if(d.name == '[C]'){
                        return 'Conference' + " (" + size + ")";
                    }
                    else if(d.name == '[J]'){
                        return 'Journal' + " (" + size + ")";
                    }
                    else if(d.name == '[O]'){
                        return 'Others' + " (" + size + ")";
                    }
                    else if(d.name == 'A'){
                        return 'CCF Rank A' + " (" + size + ")";
                    }
                    else if(d.name == 'B'){
                        return 'CCF Rank B' + " (" + size + ")";
                    }
                    else if(d.name == 'C'){
                        return 'CCF Rank C' + " (" + size + ")";
                    }
                    else if(d.name == 'O'){
                        return 'Others' + " (" + size + ")";
                    }
                    else if(d.name == 'OTHERS'){
                        return 'Other Venues' + " (" + size + ")";
                    }
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){
                        if(d.name.indexOf('~') != -1){
                            return d.name.substring(d.name.indexOf('~')+1, d.name.length) + " (" + size + ")";
                        }
                    }
                    return d.name + " (" + size + ")";
                }
                else if(Show_Sunbursts_all['up']['group_lists'].hasOwnProperty(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth])){
                    var this_list = Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth]]['lists'];
                    var this_object = new Object();
                    Object.keys(this_list).forEach(function(key){
                        if(this_object.hasOwnProperty(this_list[key])){
                            this_object[this_list[key]].push(key);
                        }
                        else{
                            this_object[this_list[key]] = [];
                            this_object[this_list[key]].push(key);
                        }
                    });
                    var show_text = '';
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){                        
                        if(d.name.indexOf('~') != -1){
                            show_text += d.name.substring(0, d.name.indexOf('~')) + ": ";
                        }
                        else{
                            show_text += d.name + ": ";
                        }
                        if(this_object[d.name].length == 1){
                            show_text += this_object[d.name][0].substring(this_object[d.name][0].indexOf('~')+1, this_object[d.name][0].length);
                        }
                        else{
                            for(var i = 0; i < this_object[d.name].length; i ++){
                                show_text += this_object[d.name][i].substring(0, this_object[d.name][i].indexOf('~'));
                                if(i != this_object[d.name].length -1){
                                    show_text += ", ";
                                }
                            }
                        }
                    }
                    else{
                        show_text += d.name + ": ";
                        for(var i = 0; i < this_object[d.name].length; i ++){
                            show_text += this_object[d.name][i];
                            if(i != this_object[d.name].length -1){
                                show_text += ", ";
                            }
                        }
                    }
                    // Object.keys(this_object).forEach(function(key){
                    //     show_text = show_text + key + ": ";
                    //     for(var i = 0; i < this_object[key].length; i++){
                    //         show_text = show_text + this_object[key][i];
                    //         if(i != this_object[key].length - 1){
                    //             show_text += ", "
                    //         }
                    //         else{
                    //             show_text += "; "
                    //         }
                    //     }
                    // })                    
                    return show_text;
                }
                else{
                    if(d.name == '[C]'){
                        return 'Conference';
                    }
                    else if(d.name == '[J]'){
                        return 'Journal';
                    }
                    else if(d.name == '[O]'){
                        return 'Others';
                    }
                    else if(d.name == 'A'){
                        return 'CCF Rank A';
                    }
                    else if(d.name == 'B'){
                        return 'CCF Rank B';
                    }
                    else if(d.name == 'C'){
                        return 'CCF Rank C';
                    }
                    else if(d.name == 'O'){
                        return 'Others';
                    }
                    else if(d.name == 'OTHERS'){
                        return 'Other Venues';
                    }
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){
                        return d.name.substring(d.name.indexOf('~')+1, d.name.length);
                    }
                    return d.name;
                }
            });
        })
        .on("mouseout", function(){
            d3.select("#down_sunburst").selectAll(".node")
            .style("fill", function(one_rect){
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['down'];
                }
            });

            d3.select("#up_sunburst").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    if(one_rect.depth == upnodes[upnodes.length-1].depth){
                        if(one_rect.size > downnodes[i].size){
                            return up_down_colorlist["up"];
                        }
                        else{
                            return up_down_colorlist["down"];
                        }
                    }
                    else{
                        return "lightgray";
                    }
                }
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['up'];
                }
            });

            d3.select("#up_minimap").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    if(one_rect.depth == upnodes[upnodes.length-1].depth){
                        if(one_rect.size > downnodes[i].size){
                            return up_down_colorlist["up"];
                        }
                        else{
                            return up_down_colorlist["down"];
                        }
                    }
                    else{
                        return "lightgray";
                    }
                }
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['up'];
                }
            });

            d3.select("#down_minimap").selectAll(".node")
            .style("fill", function(one_rect){
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['down'];
                }
            });

            if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                d3.select("#up_sunburst").selectAll(".bar")
                .style("fill", function(one_rect,i){
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(one_rect.depth == upnodes[upnodes.length-1].depth){
                            if(one_rect.size < downnodes[i].size){
                                return up_down_colorlist["up"];
                            }
                            else{
                                return up_down_colorlist["down"];
                            }
                        }
                        else{
                            return "lightgray";
                        }
                    }
                    return up_down_colorlist['down'];
                });

                d3.select("#down_sunburst").selectAll(".bar")
                .style("fill", function(){
                    return up_down_colorlist['up'];
                });
            }

            d3.selectAll(".label")
            .style("opacity", function(one_text){
                if(one_text.dx <= 9){
                    return 0;
                }
                else{
                    return 1;
                }
            });

            var up_show = document.getElementById("up_show_text");
            up_show.parentNode.removeChild(up_show);
        });
        //.call(drag);

    console.log(upnodes)

    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
        up_sun_g.selectAll(".bar")
        .data(upnodes)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d, i) {
            if(d.depth == upnodes[upnodes.length-1].depth){
                if(d.size > downnodes[i].size){
                    if(downnodes[i].size == 0 || downnodes[i].size == -1){
                        return 300 - 30 * (upnodes[upnodes.length-1].depth -1) - 2
                    }
                    return 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(downnodes[i].size);
                }
                else{
                    if(d.size == 0 || d.size == -1){
                        return 300 - 30 * (upnodes[upnodes.length-1].depth -1) - 2
                    }
                    return 300 - 30 * (upnodes[upnodes.length-1].depth -1) - yScale(d.size);
                }
            }
            return d.y;
        })
        .attr("width", function(d) { return d.dx; })
        .attr("height", function(d,i) {
            if(d.depth == upnodes[upnodes.length-1].depth){
                if(d.size > downnodes[i].size){
                    if(downnodes[i].size == 0 || downnodes[i].size == -1){
                        return 2
                    }
                    return yScale(downnodes[i].size)
                }
                else{
                    if(d.size == 0 || d.size == -1){
                        return 2
                    }
                    return yScale(d.size)
                }
            }
            else{
                return 0;
            }
            return d.dy
        })
        .style("fill", function(d,i){
            if(d.depth == upnodes[upnodes.length-1].depth){
                if(d.size > downnodes[i].size){
                    return up_down_colorlist["down"];
                }
                else{
                    return up_down_colorlist["up"];
                }
            }
            else{
                return d3.rgb(0,0,0,0);
            }
        })
        .style("stroke", "white")
        .on("mouseover", function(d, j){
            d3.select(this)
            .style("cursor", "pointer");

            d3.select("#up_sunburst").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(one_rect.depth == upnodes[upnodes.length-1].depth){
                        if(one_rect.size > downnodes[i].size){
                            return up_down_colorlist["up"];
                        }
                        else{
                            return up_down_colorlist["down"];
                        }
                    }
                    else{
                        return "lightgray";
                    }
                }
            });

            d3.select("#up_minimap").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(one_rect.depth == upnodes[upnodes.length-1].depth){
                        if(one_rect.size > downnodes[i].size){
                            return up_down_colorlist["up"];
                        }
                        else{
                            return up_down_colorlist["down"];
                        }
                    }
                    else{
                        return "lightgray";
                    }
                }
            });

            d3.select("#up_sunburst").selectAll(".bar")
            .style("fill", function(one_rect,i){
                if(d.name == one_rect.name){
                    return "orange";
                }
                if(one_rect.depth == upnodes[upnodes.length-1].depth){
                    if(one_rect.size > downnodes[i].size){
                        return up_down_colorlist["up"];
                    }
                    else{
                        return up_down_colorlist["down"];
                    }
                }
                else{
                    return "lightgray";
                }
            });

            d3.selectAll(".label")
            .style("opacity", function(one_text){
                if(d.name == one_text.name && d.x == one_text.x && d.y == one_text.y){
                    return 1;
                }
                else{
                    if(one_text.dx <= 9){
                        return 0;
                    }
                    else{
                        return 1;
                    }
                }
            });

            d3.select("#up_logo")
            .append("text")
            .attr("id", "up_show_text")
            .attr("x", -640)
            .attr("y", -7)
            .style("font-size", 13)
            .style("font-family", "Arial")
            .style("fill", "orange")
            .text(function(){
                if(d.depth == Show_Sunbursts_all['up']['show_group_by'].length){
                    var size = 0;
                    if(d.size > -1){
                        size = d.size;
                    }
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(downnodes[j].size == undefined){
                            downnodes[j].size = "0"
                        }
                        if(d.name == '[C]'){
                            return 'Conference' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == '[J]'){
                            return 'Journal' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == '[O]'){
                            return 'Others' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'A'){
                            return 'CCF Rank A' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'B'){
                            return 'CCF Rank B' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'C'){
                            return 'CCF Rank C' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'O'){
                            return 'Others' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'OTHERS'){
                            return 'Other Venues' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                    }
                    if(d.name == '[C]'){
                        return 'Conference' + " (" + size + ")";
                    }
                    else if(d.name == '[J]'){
                        return 'Journal' + " (" + size + ")";
                    }
                    else if(d.name == '[O]'){
                        return 'Others' + " (" + size + ")";
                    }
                    else if(d.name == 'A'){
                        return 'CCF Rank A' + " (" + size + ")";
                    }
                    else if(d.name == 'B'){
                        return 'CCF Rank B' + " (" + size + ")";
                    }
                    else if(d.name == 'C'){
                        return 'CCF Rank C' + " (" + size + ")";
                    }
                    else if(d.name == 'O'){
                        return 'Others' + " (" + size + ")";
                    }
                    else if(d.name == 'OTHERS'){
                        return 'Other Venues' + " (" + size + ")";
                    }
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){
                        if(d.name.indexOf('~') != -1){
                            return d.name.substring(d.name.indexOf('~')+1, d.name.length) + " (" + size + ")";
                        }
                    }
                    return d.name + " (" + size + ")";
                }
                else if(Show_Sunbursts_all['up']['group_lists'].hasOwnProperty(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth])){
                    var this_list = Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth]]['lists'];
                    var this_object = new Object();
                    Object.keys(this_list).forEach(function(key){
                        if(this_object.hasOwnProperty(this_list[key])){
                            this_object[this_list[key]].push(key);
                        }
                        else{
                            this_object[this_list[key]] = [];
                            this_object[this_list[key]].push(key);
                        }
                    });
                    var show_text = '';
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){                        
                        if(d.name.indexOf('~') != -1){
                            show_text += d.name.substring(0, d.name.indexOf('~')) + ": ";
                        }
                        else{
                            show_text += d.name + ": ";
                        }
                        if(this_object[d.name].length == 1){
                            show_text += this_object[d.name][0].substring(this_object[d.name][0].indexOf('~')+1, this_object[d.name][0].length);
                        }
                        else{
                            for(var i = 0; i < this_object[d.name].length; i ++){
                                show_text += this_object[d.name][i].substring(0, this_object[d.name][i].indexOf('~'));
                                if(i != this_object[d.name].length -1){
                                    show_text += ", ";
                                }
                            }
                        }
                    }
                    else{
                        show_text += d.name + ": ";
                        for(var i = 0; i < this_object[d.name].length; i ++){
                            show_text += this_object[d.name][i];
                            if(i != this_object[d.name].length -1){
                                show_text += ", ";
                            }
                        }
                    }
                    // Object.keys(this_object).forEach(function(key){
                    //     show_text = show_text + key + ": ";
                    //     for(var i = 0; i < this_object[key].length; i++){
                    //         show_text = show_text + this_object[key][i];
                    //         if(i != this_object[key].length - 1){
                    //             show_text += ", "
                    //         }
                    //         else{
                    //             show_text += "; "
                    //         }
                    //     }
                    // })                    
                    return show_text;
                }
                else{
                    if(d.name == '[C]'){
                        return 'Conference';
                    }
                    else if(d.name == '[J]'){
                        return 'Journal';
                    }
                    else if(d.name == '[O]'){
                        return 'Others';
                    }
                    else if(d.name == 'A'){
                        return 'CCF Rank A';
                    }
                    else if(d.name == 'B'){
                        return 'CCF Rank B';
                    }
                    else if(d.name == 'C'){
                        return 'CCF Rank C';
                    }
                    else if(d.name == 'O'){
                        return 'Others';
                    }
                    else if(d.name == 'OTHERS'){
                        return 'Other Venues';
                    }
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){
                        return d.name.substring(d.name.indexOf('~')+1, d.name.length);
                    }
                    return d.name;
                }
            });
        })
        .on("mouseout", function(){

            d3.select("#up_sunburst").selectAll(".node")
            .style("fill", function(d,i){
                if(d.depth == upnodes[upnodes.length-1].depth){
                    if(d.size > downnodes[i].size){
                        return up_down_colorlist["up"];
                    }
                    else{
                        return up_down_colorlist["down"];
                    }
                }
                else{
                    return "lightgray";
                }
            });

            d3.select("#up_minimap").selectAll(".node")
            .style("fill", function(d,i){
                if(d.depth == upnodes[upnodes.length-1].depth){
                    if(d.size > downnodes[i].size){
                        return up_down_colorlist["up"];
                    }
                    else{
                        return up_down_colorlist["down"];
                    }
                }
                else{
                    return "lightgray";
                }
            });

            d3.select("#down_minimap").selectAll(".node")
            .style("fill", function(one_rect){
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['down'];
                }
            });

            if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                d3.select("#up_sunburst").selectAll(".bar")
                .style("fill", function(d,i){
                    if(d.depth == upnodes[upnodes.length-1].depth){
                        if(d.size < downnodes[i].size){
                            return up_down_colorlist["up"];
                        }
                        else{
                            return up_down_colorlist["down"];
                        }
                    }
                    else{
                        return "lightgray";
                    }
                });

                d3.select("#down_sunburst").selectAll(".bar")
                .style("fill", function(){
                    return up_down_colorlist['up'];
                });
            }

            d3.selectAll(".label")
            .style("opacity", function(one_text){
                if(one_text.dx <= 9){
                    return 0;
                }
                else{
                    return 1;
                }
            });

            var up_show = document.getElementById("up_show_text");
            up_show.parentNode.removeChild(up_show);
        });
    }

    up_sun_g.selectAll(".ticks")
            .data([50, 100, 150])
            .enter()
            .append("rect")
            .attr("class", "ticks")
            .attr("x", function(){
                if(x_offset == 0){
                    return x_offset;
                }
                else{
                    return x_offset - 320; 
                }
            })
            .attr("y", function(d){
                return 300 - 30 * (upnodes[upnodes.length-1].depth-1) - d;
            })
            .attr("width", 640)
            .attr("height", 1)
            .style("fill", "darkgray")
            .style("opacity", 0.2);
    
    up_sun_g.selectAll(".ticks_text")
            .data([50, 100, 150])
            .enter()
            .append("text")
            .text(function(d){
                if(scale_method % 3 == 0){
                    return Math.round(d * max_size / 150);
                }
                else if(scale_method % 3 == 1){
                    return Math.round(Math.pow((d*Math.sqrt(max_size)/150), 2));
                }
                else if(scale_method % 3 == 2){
                    return Math.round(Math.pow(Math.E, (d*Math.log(max_size+1)/150)) - 1);
                }
            })
            .attr("class", "ticks_text")
            .attr("x", function(){
                if(x_offset == 0){
                    return x_offset + 2;
                }
                else{
                    return x_offset - 320 + 2; 
                }
            })
            .attr("y", function(d){
                return 300 - 30 * (upnodes[upnodes.length-1].depth-1) - d - 3;
            })
            .style("font-size", 10)
            .style("font-family", "Arial")
            .style("fill", "darkgray");

    up_sun_g.selectAll(".label")
        .data(upnodes.filter(function(d,i) { 
            //return (d.dx > 6 && i && (d.size == undefined)); }))
            return (i); }))
        .enter().append("text")
        .attr("class", "label")
        .style("font-size", 10)
        .style("font-family", "Arial")
        .style("text-anchor", function(d){
            if(typeof(d.size) == "undefined"){
                return "middle";
            }
            return "end";
        })
        .attr("transform", function(d, i) { 
            //console.log(d.size)
            if(typeof(d.size) == "undefined"){
                if(Show_Sunbursts_all['up']['group_lists'].hasOwnProperty(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth]) && d.depth != Show_Sunbursts_all['up']['show_group_by'].length){
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] != "P. Venue" && Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] != "C. Venue"){
                        // if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        //     return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+20) + ")";
                        // }
                        return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy/2+5) + ")"; 
                    }
                }
                // if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                //     return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2 + 15) + ")rotate(90)";
                // }
                return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy/2) + ")rotate(90)";
            }
            else{
                // if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                //     if(d.size <= downnodes[i+1].size){
                //         return "translate(" + (d.x + d.dx / 2-3) + "," + (d.y + d.dy + yScale(d.size)- 5) + ")rotate(90)";
                //     }
                // }
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
        })
        .on("mouseover", function(d, j){
            d3.select(this)
            .style("cursor", "pointer")
            .style("opacity", 1);

            d3.select("#up_sunburst").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(d.name == one_rect.name){
                    return "orange";
                }
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    if(one_rect.depth != upnodes[upnodes.length-1].depth){
                        return "lightgray";
                    }
                    else{
                        if(one_rect.size < downnodes[i].size){
                            return up_down_colorlist['down']; 
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                }
                else{
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                }
            })

            d3.select("#down_sunburst").selectAll(".node")
            .style("fill", function(one_rect){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                }
            });

            d3.select("#up_minimap").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(d.name == one_rect.name){
                    return "orange";
                }
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    if(one_rect.depth != upnodes[upnodes.length-1].depth){
                        return "lightgray";
                    }
                    else{
                        if(one_rect.size < downnodes[i].size){
                            return up_down_colorlist['down']; 
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                }
                else{
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                }
            });

            d3.select("#down_minimap").selectAll(".node")
            .style("fill", function(one_rect){
                if(d.name == one_rect.name){
                    return "orange";
                }
                else{
                    if(one_rect.color == 0){
                        return "white";
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                }
            });

            if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                d3.select("#up_sunburst").selectAll(".bar")
                .style("fill", function(one_rect,i){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(one_rect.depth != upnodes[upnodes.length-1].depth){
                            return "lightgray";
                        }
                        else{
                            if(one_rect.size > downnodes[i].size){
                                return up_down_colorlist['down']; 
                            }
                            else{
                                return up_down_colorlist['up'];
                            }
                        }
                    }
                    else{
                        return up_down_colorlist['down'];
                    }
                });

                d3.select("#down_sunburst").selectAll(".bar")
                .style("fill", function(one_rect){
                    if(d.name == one_rect.name){
                        return "orange";
                    }
                    else{
                        return up_down_colorlist['up'];
                    }
                });
            }

            d3.select("#up_logo")
            .append("text")
            .attr("id", "up_show_text")
            .attr("x", -640)
            .attr("y", -7)
            .style("font-size", 13)
            .style("font-family", "Arial")
            .style("fill", "orange")
            .text(function(){
                if(d.depth == Show_Sunbursts_all['up']['show_group_by'].length){
                    var size = 0;
                    if(d.size > -1){
                        size = d.size;
                    }
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(downnodes[j].size == undefined){
                            downnodes[j].size = "0"
                        }
                        if(d.name == '[C]'){
                            return 'Conference' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == '[J]'){
                            return 'Journal' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == '[O]'){
                            return 'Others' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'A'){
                            return 'CCF Rank A' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'B'){
                            return 'CCF Rank B' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'C'){
                            return 'CCF Rank C' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'O'){
                            return 'Others' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                        else if(d.name == 'OTHERS'){
                            return 'Other Venues' + " (Upper: " + size + ", " + "Lower: " + downnodes[j].size + ")";
                        }
                    }
                    if(d.name == '[C]'){
                        return 'Conference' + " (" + size + ")";
                    }
                    else if(d.name == '[J]'){
                        return 'Journal' + " (" + size + ")";
                    }
                    else if(d.name == '[O]'){
                        return 'Others' + " (" + size + ")";
                    }
                    else if(d.name == 'A'){
                        return 'CCF Rank A' + " (" + size + ")";
                    }
                    else if(d.name == 'B'){
                        return 'CCF Rank B' + " (" + size + ")";
                    }
                    else if(d.name == 'C'){
                        return 'CCF Rank C' + " (" + size + ")";
                    }
                    else if(d.name == 'O'){
                        return 'Others' + " (" + size + ")";
                    }
                    else if(d.name == 'OTHERS'){
                        return 'Other Venues' + " (" + size + ")";
                    }
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){
                        if(d.name.indexOf('~') != -1){
                            return d.name.substring(d.name.indexOf('~')+1, d.name.length) + " (" + size + ")";
                        }
                    }
                    return d.name + " (" + size + ")";
                }
                else if(Show_Sunbursts_all['up']['group_lists'].hasOwnProperty(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth])){
                    var this_list = Show_Sunbursts_all['up']['group_lists'][Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length-d.depth]]['lists'];
                    var this_object = new Object();
                    Object.keys(this_list).forEach(function(key){
                        if(this_object.hasOwnProperty(this_list[key])){
                            this_object[this_list[key]].push(key);
                        }
                        else{
                            this_object[this_list[key]] = [];
                            this_object[this_list[key]].push(key);
                        }
                    });
                    var show_text = '';
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){                        
                        if(d.name.indexOf('~') != -1){
                            show_text += d.name.substring(0, d.name.indexOf('~')) + ": ";
                        }
                        else{
                            show_text += d.name + ": ";
                        }
                        if(this_object[d.name].length == 1){
                            show_text += this_object[d.name][0].substring(this_object[d.name][0].indexOf('~')+1, this_object[d.name][0].length);
                        }
                        else{
                            for(var i = 0; i < this_object[d.name].length; i ++){
                                show_text += this_object[d.name][i].substring(0, this_object[d.name][i].indexOf('~'));
                                if(i != this_object[d.name].length -1){
                                    show_text += ", ";
                                }
                            }
                        }
                    }
                    else{
                        show_text += d.name + ": ";
                        for(var i = 0; i < this_object[d.name].length; i ++){
                            show_text += this_object[d.name][i];
                            if(i != this_object[d.name].length -1){
                                show_text += ", ";
                            }
                        }
                    }
                    // Object.keys(this_object).forEach(function(key){
                    //     show_text = show_text + key + ": ";
                    //     for(var i = 0; i < this_object[key].length; i++){
                    //         show_text = show_text + this_object[key][i];
                    //         if(i != this_object[key].length - 1){
                    //             show_text += ", "
                    //         }
                    //         else{
                    //             show_text += "; "
                    //         }
                    //     }
                    // })                    
                    return show_text;
                }
                else{
                    if(d.name == '[C]'){
                        return 'Conference';
                    }
                    else if(d.name == '[J]'){
                        return 'Journal';
                    }
                    else if(d.name == '[O]'){
                        return 'Others';
                    }
                    else if(d.name == 'A'){
                        return 'CCF Rank A';
                    }
                    else if(d.name == 'B'){
                        return 'CCF Rank B';
                    }
                    else if(d.name == 'C'){
                        return 'CCF Rank C';
                    }
                    else if(d.name == 'O'){
                        return 'Others';
                    }
                    else if(d.name == 'OTHERS'){
                        return 'Other Venues';
                    }
                    if(Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "P. Venue" || Show_Sunbursts_all['up']['show_group_by'][Show_Sunbursts_all['up']['show_group_by'].length - d.depth] == "C. Venue"){
                        return d.name.substring(d.name.indexOf('~')+1, d.name.length);
                    }
                    return d.name;
                }
            });
        })
        .on("mouseout", function(){
            d3.select(this)
            .style("opacity", function(d){
                if(d.dx <= 9){
                    return 0;
                }
                else{
                    return 1;
                }
            });

            d3.select("#down_sunburst").selectAll(".node")
            .style("fill", function(one_rect){
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['down'];
                }
            });

            d3.select("#up_sunburst").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    if(one_rect.depth != upnodes[upnodes.length-1].depth){
                        return "lightgray";
                    }
                    else{
                        if(one_rect.size < downnodes[i].size){
                            return up_down_colorlist['down']; 
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                }
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['up'];
                }
            });

            d3.select("#up_minimap").selectAll(".node")
            .style("fill", function(one_rect,i){
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    if(one_rect.depth != upnodes[upnodes.length-1].depth){
                        return "lightgray";
                    }
                    else{
                        if(one_rect.size < downnodes[i].size){
                            return up_down_colorlist['down']; 
                        }
                        else{
                            return up_down_colorlist['up'];
                        }
                    }
                }
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['up'];
                }
            });

            d3.select("#down_minimap").selectAll(".node")
            .style("fill", function(one_rect){
                if(one_rect.color == 0){
                    return "white";
                }
                else{
                    return up_down_colorlist['down'];
                }
            });

            if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                d3.select("#up_sunburst").selectAll(".bar")
                .style("fill", function(one_rect,i){
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(one_rect.depth != upnodes[upnodes.length-1].depth){
                            return "lightgray";
                        }
                        else{
                            if(one_rect.size > downnodes[i].size){
                                return up_down_colorlist['down']; 
                            }
                            else{
                                return up_down_colorlist['up'];
                            }
                        }
                    }
                    return up_down_colorlist['down'];
                });

                d3.select("#down_sunburst").selectAll(".bar")
                .style("fill", function(){
                    return up_down_colorlist['up'];
                });
            }

            var up_show = document.getElementById("up_show_text");
            up_show.parentNode.removeChild(up_show);
        });

    if(mini_tag == 1){
        if(change_scale_signal == 0){
            add_up_mini_map(uid, data, [0,640]);
        }
        else{
            add_up_mini_map(uid, data, up_mini_brush.extent());
        }
    }

    // if(mini_tag == 1 && h_width < 12){
    //     ADD_up_brush(uid, data, yScale, upnodes[upnodes.length-1].depth -1);
    // } 
}

function ADD_up_brush(uid, data, h_depth){
    var brush_xScale = d3.scale.linear()
                    .domain([0,640])
                    .range([0,640])

    var brush = d3.svg.brush().x(brush_xScale).extent([0,0]);

        var gBrush = d3.select("#sunbursts").append("g").attr("class", "up_brush").call(brush)
                    .attr("transform",function(){
                        return "translate(0," + (300 - 30 * h_depth - yScale(Show_Sunbursts_all[uid]['max_size'])) + ")";
                    });
            gBrush.selectAll("rect").attr("height", 30 * h_depth + yScale(Show_Sunbursts_all[uid]['max_size']));
            //gBrush.selectAll(".resize").append("path").attr("d", resizePath);
                    
    brush.on("brushstart.chart", function(){
    });

    brush.on("brush.chart", function(){
        var extent = brush.extent();
        var nodes = document.getElementById("up_sunburst").childNodes;

        for(var i = 0; i<nodes.length; i++){
            if(nodes[i].tagName == 'rect'){
                if((nodes[i].x.animVal.value >= extent[0]) && (nodes[i].x.animVal.value < extent[1])){
                    d3.select(nodes[i]).style("opacity", 1);
                }
                else{
                    d3.select(nodes[i]).style("opacity", 0.5);
                }
            }
        }
    });

    brush.on("brushend.chart", function() {
        var extent = brush.extent();
        var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all[uid]['node_num'] * 12;
        
        console.log(x_offset)
        
        console.log(extent)

        remove_show_text(uid);
        remove_map(uid);

        draw_up_sunburst(uid, data, 12, x_offset, 0);
        draw_minimap = 1;
        up_width = 12;
        var mini_extent_left = (extent[0] + extent[1])/2 - 320/12 * one_hist_width;
        if(mini_extent_left <= 0){
            mini_extent_left = 0;
        }
        var mini_extent_right = (extent[0] + extent[1])/2 + 320/12 * one_hist_width;
        if(mini_extent_right > 640){
            mini_extent_right = 640;
        }
        add_up_mini_map(uid, data, [mini_extent_left, mini_extent_right], x_offset);

        if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
            remove_show_text('down');
            remove_map('down');

            draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], 12, x_offset, 0);
            down_width = 12;
            add_down_mini_map('down', Show_Sunbursts_all['down']['tree'], [mini_extent_left, mini_extent_right], x_offset);
        }
    });
}

var up_width = 12;
var up_mini_brush;
function add_up_mini_map(uid, data, orign_extent){
    up_map = d3.select("#show_sunbursts").append("svg")
                .attr("id", "up_mini")
                .attr("class", "up_mini")
                .style("width", 650)
                .style("height", 30);

    up_mini_g = up_map.append("g")
                .attr("id", "up_minimap")
                .attr("transform", function(){
                    return "translate(0,0)";
                });

    up_mini_g.append("rect")
            .attr("x", 0)
            .attr("y", 30)
            .attr("width", 640)
            .attr("height", 2)
            .style("fill", function(){
                if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    return "lightgray";
                }
                return up_down_colorlist['up']
            })
            .style("stroke", "white");
                
    // up_mini_g.append("text")
    //         .text("x ")
    //         .style("fill", d3.rgb(128,177,211))
    //         .attr("x", 645)
    //         .attr("y", 30)
    //         .style("font-family", "verdana")
    //         .style("font-size", 13)
    //         .on("mouseover", function(){
    //             d3.select(this)
    //             .style("fill", "red")
    //             .style("cursor", "pointer");
    //         })
    //         .on("mouseout", function(){
    //             d3.select(this)
    //             .style("fill", d3.rgb(128,177,211));
    //         })
    //         .on("click", function(){
    //             remove_minimap(uid);
    //             remove_map(uid);
    //             draw_up_sunburst(uid, data, yScale, one_hist_width, 0, 1);

    //             if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
    //                 remove_minimap('down');
    //                 remove_map('down');
    //                 draw_down_sunburst('down', Show_Sunbursts_all['down']['tree'], yScale, one_hist_width, 0, 1);
    //             }
    //         });
    
    var upwidth = Show_Sunbursts_all[uid]['node_num'] * one_hist_width;

    var up_mini_partition = d3.layout.partition()
                .size([upwidth, 30])
                .value(function() { return 1; })
                .sort(null);
    
    var up_mini_nodes = up_mini_partition.nodes(data);

    //var up_mini_yscale = d3.scale.linear()
    //            .domain([0, Show_Sunbursts_all[uid]['max_size']])
    //            .range([0,18]);

    up_mini_g.selectAll(".node")
                .data(up_mini_nodes)
                .enter().append("rect")
                .attr("class", "node")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d,i) {
                    if(d.depth == up_mini_nodes[up_mini_nodes.length-1].depth){
                        if(updraw == 1 && downdraw == 1 && align_num%2 == 1 & d.size < downnodes[i].size){
                            if(downnodes[i].size > 0){
                                d.y = 30 - 4 * (up_mini_nodes[up_mini_nodes.length-1].depth -1) - up_mini_yscale(downnodes[i].size);
                            }
                            else{
                                d.y = 30 - 4 * (up_mini_nodes[up_mini_nodes.length-1].depth -1) - up_mini_yscale(0);
                            }    
                        }
                        else{
                            if(d.size > 0){
                                d.y = 30 - 4 * (up_mini_nodes[up_mini_nodes.length-1].depth -1) - up_mini_yscale(d.size);
                            }
                            else{
                                d.y = 30 - 4 * (up_mini_nodes[up_mini_nodes.length-1].depth -1) - up_mini_yscale(0);
                            }
                        }
                    }
                    else{
                        d.y = 30 - 4 * d.depth;
                    }
                    return d.y;
                })
                .attr("width", function(d) { return d.dx; })
                .attr("height", function(d,i) {
                    if(d.depth == 0){
                        d.dy = 0;
                    }
                    else if(d.depth == up_mini_nodes[up_mini_nodes.length-1].depth){
                        if(updraw == 1 && downdraw == 1 && align_num%2 == 1 & d.size < downnodes[i].size){
                            if(downnodes[i].size > 0){
                                d.dy = up_mini_yscale(downnodes[i].size);
                            }
                            else{
                                d.dy = up_mini_yscale(0);
                            }    
                        }
                        else{
                            if(d.size > 0){
                                d.dy = up_mini_yscale(d.size);
                            }
                            else{
                                d.dy = up_mini_yscale(0);
                            }
                        }
                    }
                    else{
                        d.dy = 4;
                    }
                    return d.dy;
                })
                .style("fill", function(d,i){
                    if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                        if(d.depth == upnodes[upnodes.length-1].depth){
                            if(d.size < downnodes[i].size){
                                return up_down_colorlist["down"];
                            }
                            else{
                                return up_down_colorlist["up"];
                            }
                        }
                        else{
                            return "lightgray";
                        }
                    }
                    return up_down_colorlist["up"];
                })
                .style("stroke", "white");
                
                var brush_width = 0;

                var brush_xScale = d3.scale.linear()
                .domain([0,640])
                .range([0,640])

                up_mini_brush = d3.svg.brush().x(brush_xScale).extent(orign_extent);

                    var gBrush = up_map.append("g").attr("class", "brush").attr("id", "up_mini_brush")
                                .call(up_mini_brush)
                                .attr("transform",function(){
                                    return "translate(0,3)";
                                });
                                
                        gBrush.selectAll("rect").attr("height", 30);
                        //gBrush.selectAll(".resize").append("path").attr("d", resizePath);
                                
                up_mini_brush.on("brushstart.chart", function(){
                    var extent = up_mini_brush.extent();
                    brush_width = extent[1] - extent[0];
                });

                up_mini_brush.on("brush.chart", function(){
                    var extent = up_mini_brush.extent();
                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all[uid]['node_num'] * up_width;
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
                    // if(extent[1] - extent[0] == brush_width){
                    //     drag_slider(uid, 320 - x_offset);

                    //     if(updraw == 1 && downdraw == 1 && align_num%2 == 1){
                    //         down_mini_brush.extent(extent);
                    //         d3.select("#down_mini_brush").call(down_mini_brush);
                    //         drag_slider('down', 320 - x_offset);
                    //     }
                    // }
                    //else{
                    up_width = 640 / ((extent[1] - extent[0]) / one_hist_width);

                    remove_show_text(uid);
                    remove_map(uid);
                    draw_up_sunburst(uid, data, up_width, x_offset, 0);


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

                    // if(updraw == 1 && downdraw == 1 && lock_num%2 ==0){
                    //     if((extent[1] - extent[0]) != brush_width || align_num % 2 == 1){
                    //         nodes = document.getElementById("down_minimap").childNodes;
                    //         for(var i = 0; i<nodes.length; i++){
                    //             if(nodes[i].tagName == 'rect'){
                    //                 if((nodes[i].x.animVal.value >= extent[0]) && ((nodes[i].x.animVal.value+nodes[i].width.animVal.value) <= extent[1])){
                    //                     d3.select(nodes[i]).style("opacity", 1);
                    //                 }
                    //                 else{
                    //                     d3.select(nodes[i]).style("opacity", 0.3);
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                });

                up_mini_brush.on("brushend.chart", function() {
                    var extent = up_mini_brush.extent();
                    brush_width = extent[1] - extent[0];
                    var x_offset = (extent[1]+extent[0])/2/640*Show_Sunbursts_all[uid]['node_num'] * up_width;
                    if(brush_width == 0){
                        up_width = one_hist_width;
                        x_offset = 0;
                        extent = [0,640];
                        up_mini_brush.extent(extent);
                        d3.select("#up_mini_brush").call(up_mini_brush);
                    }
                    else{
                        up_width = 640 / ((extent[1] - extent[0]) / one_hist_width);
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
                    }

                    remove_show_text(uid);
                    remove_map(uid);
                    draw_up_sunburst(uid, data, up_width, x_offset, 0);

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

                    
                });

}

function remove_show_text(uid){
    var show = document.getElementById(uid + "_show_text");
    if(show != null){
        show.parentNode.removeChild(show); 
    }
}

function remove_minimap(uid){
    var parent = document.getElementById("show_sunbursts")
    var childrens = parent.childNodes;
    if(childrens != ''){
        for(var i = childrens.length-1; i >=0; i--)
        {
            if(d3.select(childrens[i]).attr('id') == uid + "_mini"){
                parent.removeChild(childrens[i]);
            }  
        }
    }
}

function remove_map(uid){
    var parent = document.getElementById("sunbursts")
    var childrens = parent.childNodes;
    if(childrens != ''){
        for(var i = childrens.length-1; i >=0; i--)
        {
            if(d3.select(childrens[i]).attr('id') == uid + "_sunburst"){
                parent.removeChild(childrens[i]);
            }  
        }
    }  
}

function remove_brush(uid){
    var parent = document.getElementById("sunbursts")
    var childrens = parent.childNodes;
    if(childrens != ''){
        for(var i = childrens.length-1; i >=0; i--)
        {
            if(d3.select(childrens[i]).attr("class") == uid + "_brush"){
                parent.removeChild(childrens[i]);
            }
        }
    }
}