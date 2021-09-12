
function add_hints(text){
    d3.select("#hints")
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .text(function(){
        if(text == "addPanel"){
            return "Click to create a paper set."
        }
        else if(text == "removePanel"){
            return "Click to cancel the creation."
        }
        else if(text == "addpaperset"){
            return "Click to add the paper set."
        }
        else if(text == "removepaperset"){
            return "Click to remove this paper set."
        }
        else if(text == "torightpart"){
            return "Click to add this paper set to the hierarchical histogram for further investigation.";
        }
        else if(text == "scale_linear"){
            return "Click to change the scaling method to linear for displaying the vertical bars in the hierarchical histogram."
        }
        else if(text == "scale_sqrt"){
            return "Click to change the scaling method to square root for displaying the vertical bars in the hierarchical histogram."
        }
        else if(text == "scale_log"){
            return "Click to change the scaling method to logarithmic for displaying the vertical bars in the hierarchical histogram."
        }
        else if(text == "lock"){
            return "Click to synchronize the attributes used to partition the data for the upper and lower histograms."
        }
        else if(text == "unlock"){
            return "Click to unsynchronize the attributes used to partition the data for the upper and lower histograms."
        }
        else if(text == "aligned"){
            return "Click to align the corresponding horizontal bars at the coarsest level in the upper and lower hierarchical histograms."
        }
        else if(text == "compact"){
            return "Click to unalign the corresponding horizontal bars at the coarsest level in the upper and lower hierarchical histograms."
        }
        else if(text == "changeproperty"){
            return "Click to change the display attribute of the vertical bars."
        }
        else if(text == "changeattributes"){
            return "Click to edit the corresponding attribute or drag the attribute up and down to to swap the partitioning order."
        }
        else if(text == "addattributes"){
            return "Click to add an attribute to further partition the hierarchical histogram."
        }
    })
    .style("font-family", "Arial")
    .style("color", Unclickable_name_color);
}

function remove_hints(){
    Remove_nodechildren("hints");
}

function add_paperset_hints(text){
    d3.select("#hints")
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .text(function(){
        return text;
    })
    .style("font-family", "Arial")
    .style("color", Unclickable_name_color);
}