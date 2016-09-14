/*global controldef*/

module.exports = {
  controldef: function (ctrl,ctrltype,ctrlname,ctrlID,properties){
        var control = "";
        
        control += "<";
        control += ctrl;
        
        if(ctrl=="input"){
            control += " type='" + ctrltype + "'";
            control += " " + properties;
        }
        
        control += " name='" + ctrlname + "'";
        control += " id='" + ctrlID + "'";
        control += ">";
        
        return control;
    }
};