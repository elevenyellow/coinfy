
/*
    https://github.com/Josenzo/sortBy
    Copyright (c) 2015 Josema Enzo
    http://opensource.org/licenses/MIT
*/

var sortBy = Array.prototype.sortBy = (function(){
    

    // Utility to get deep properties by the path given
    var get = function(obj, path) {

        try {
            for (var i = 0; i<path.length-1; i++)
                obj = obj[ path[i] ];

            return obj[ path[i] ];
        } catch(e) {
            return obj;
        }

    };


    return function() {

        var property, one, two, diff, i=1, total=arguments.length, array=arguments[0], properties=[], tproperties=total-1;

        // If is called as method of the array itself
        if (this instanceof Array) {
            array = this;
            tproperties = total;
            i = 0;
        }


        // Storing the properties needed for the search
        for (; i<total; i++ ) {

            property = {};
            property.asc = 1;
            property.path = arguments[i].split('.');
            property.isdeep = property.path.length > 1;
            property.name = property.path[0];

            // Reverse
            if ( property.name.charAt(0) == '-' && !array[0].hasOwnProperty(property.name) ) {
                property.asc = -1;
                property.name = property.path[0] = property.name.slice(1);
            }

            properties.push( property );

        }




        array.sort(function check( a, b, j ) {

            // We check if the number is passed as parameter, if not we define it as 0 because is the first property to check
            if (typeof j != 'number')
                j = 0;
            // If j is greater than the total of arguments mean that we checked all the properties and all of them give us 0
            else if ( j>tproperties-1 )
                return 0;



            property = properties[j];

            // If the property is deep
            if ( property.isdeep ) {
                one = get(a, property.path);
                two = get(b, property.path);
            }
            else {
                one = a[property.name];
                two = b[property.name];
            }


            // The check
            if ( one === two )
                diff = 0;

            else if ( typeof one == 'string' )
                diff = ((one > two) ? 1 : -1) * property.asc;

            else if ( typeof one == 'number' || typeof one == 'boolean' || one instanceof Date )
                diff = (one - two) * property.asc;

            else
                return 1;

            // If diff is 0 we should recall the check function to check the other properties
            return diff || check( a, b, j+1 );

        });


        return array;

    }

})();

export default sortBy
/*

// Example of use:

var data = [
    {id:4, name:"Josema", age:34, work: {isworking:true} }, 
    {id:5, name:"Enzo", age:29, work: {isworking:true} }, 
    {id:2, name:"Josema", age:29, work: {isworking:false} }, 
    {id:1, name:"Enzo", age:29, work: {isworking:false} }, 
    {id:3, name:"Enzo", age:34, work: {isworking:false} }
];

// console.log( data.sortBy('name', 'work.isworking', '-age', 'id') );
// or this way if you dont want to create a new array
console.log( sortBy(data.slice(0), 'name', 'work.isworking', '-age', 'id') );

*/


