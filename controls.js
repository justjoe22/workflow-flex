/*global controldef*/

module.exports = {
  controldef: function (ctrl,ctrltype,ctrlname,ctrlID,properties,options){
        var control = "";
        
        control += "<";
        control += ctrl;
        
        if(ctrl=="input"){
            control += " type='" + ctrltype + "'";
            control += " " + properties;
        }
        else if(ctrl=="select"){
            control += " " + properties;  
        }
        
        control += " name='" + ctrlname + "'";
        control += " id='" + ctrlID + "'";
        control += ">";
        
        if(ctrl=="select"){
            control += " " + options;
            control += "</" + ctrl + ">";
        }
        
        return control;
    }
};