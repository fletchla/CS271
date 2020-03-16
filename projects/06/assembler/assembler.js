function hackAssembler( asmFileText ) {
    // asmFileText looks like (may have comments, etc):
    // (LOOP)
	// @1
    // D=M

    var binaryOutput = [];
    var ROMindex = 0; //current length of ROM program
    var RAMindex = 16; // start at 16 giving 0...15 for program variables

    var symbols = {
        "SP":     0,
        "LCL":    1,
        "ARG":    2,
        "THIS":   3,
        "THAT":   4,
        "SCREEN": 16384,
        "KBD":    24576,
        "R0":     0,
        "R1":     1,
        "R2":     2,
        "R3":     3,
        "R4":     4,
        "R5":     5,
        "R6":     6,
        "R7":     7,
        "R8":     8,
        "R9":     9,
        "R10":    10,
        "R11":    11,
        "R12":    12,
        "R13":    13,
        "R14":    14,
        "R15":    15,
    };

    var comp = {
        '0':    '0101010',
        '1':    '0111111',
        '-1':   '0111010',
        'D':    '0001100',
        'A':    '0110000',
        '!D':   '0001101',
        '!A':   '0110001',
        '-D':   '0001111',
        '-A':   '0110011',
        'D+1':  '0011111',
        'A+1':  '0110111',
        'D-1':  '0001110',
        'A-1':  '0110010',
        'D+A':  '0000010',
        'D-A':  '0010011',
        'A-D':  '0000111',
        'D&A':  '0000000',
        'D|A':  '0010101',
        'M':    '1110000',
        '!M':   '1110001',
        '-M':   '1110011',
        'M+1':  '1110111',
        'M-1':  '1110010',
        'D+M':  '1000010',
        'D-M':  '1010011',
        'M-D':  '1000111',
        'D&M':  '1000000',
        'D|M':  '1010101',

        // reversed versions for some situations (mult.asm uses M+D instead of D+M)
        'A+D':  '0000010',
        'A&D':  '0000000',
        'A|D':  '0010101',
        'M+D':  '1000010',
        'M&D':  '1000000',
        'M|D':  '1010101',
    }
    
    var dest = {
        'null' : '000',
        'M' : '001',
        'D' : '010',
        'MD' : '011',
        'A' : '100',
        'AM' : '101',
        'AD' : '110',
        'AMD' : '111',
    };

    var jump = {
        'null' : '000',
        'JGT' : '001',
        'JEQ' : '010',
        'JGE' : '011',
        'JLT' : '100',
        'JNE' : '101',
        'JLE' : '110',
        'JMP' : '111',
    };

    var getCommandType = function(ASMline) {
        //look for a left parenthesis, indicating a label like (LOOP)
        if (ASMline.substr(0,1) == "(") { 
            return "Label";
        }
        //look for an @ symbol, indicating an A-command like @15 or @LOOP
        else if (ASMline.substr(0,1) == "@") { 
            return "A-command";
        }
        //if it's not a label or A-command, everything else is a C type like M=D-1
        else {
            return "C-command";
        }
    };

    var addSymbol = function(name,value) {
        if ( typeof symbols[name] === "undefined" ) { //symbol doesn't exist
            symbols[name] = value;
            return true;
        }
        return false;
    };

    var processACommand = function(ASMline) {
        var name = ASMline.replace("@",""); //looks for and removes @

        if ( isNaN(name) ) { //checks if name is not a number(NaN), like LOOP
            var result = addSymbol(name,RAMindex);
            //use next available RAM index if new symbol is added
            if ( result ) {
                RAMindex++;
            }
        }
        else { //name is a number
            addSymbol(name, parseInt(name));
        }

        //convert symbol to binary, add to output
        binaryOutput.push( numberTo16bitBinary(symbols[name]) );
    };

    var processCCommand = function(ASMline) {
        var splitSemi = ASMline.split(";"); //splitSemi will be a length of 1 or 2, 2 has a Jump
        var splitEquals = splitSemi[0].split("="); //has length of 1 or 2, if 2, then 1 is dest

        //get comp,dest,jump and parse from ASMline
        var c = splitEquals[0]; //ex: A-1
        if ( splitEquals.length == 2 ) c = splitEquals[1]; 
        var d = "null"; //ex: MD
        if ( splitEquals.length == 2 ) d = splitEquals[0]; 
        var j = "null"; //ex: JGT
        if ( splitSemi.length == 2 ) j = splitSemi[1]; 

        binaryOutput.push(
            "111" + comp[c] + dest[d] + jump[j]
        );
    };

    //converts numbers to 16-bit binary
    var numberTo16bitBinary = function( number ) {
        return number.toString(2).padStart( 16, 0 );
    };

    //main processes start here
    //remove comments
    //finds all // and removes everything on the line after it
    asmFileText = asmFileText.replace(/(\/\/.*)/g, "");
   
    //remove whitespace
    //removes all spaces and tabs from lines that contain text, but not blank lines
    asmFileText = asmFileText.replace(/[ \t]+/gm, "");

    //remove blank lines
    //finds sequences of line breaks and replaces them with a single line break
    //.trim at end removes leading and trailing line breaks
    asmFileText = asmFileText.replace(/(\r\n|\r|\n)+/gm, "\n").trim();

    //convert string to array of lines
    var ASMinput = asmFileText.split("\n");
    
    //do first pass
    //.map iterates through each item in an array, param1 is value, param2 is index
    ASMinput.forEach(function(ASMline,pos) {
        switch( getCommandType(ASMline) ) {
            case "Label":
                var name = ASMline.replace(/[\(\)]/g,""); //remove parentheses
                addSymbol(name,ROMindex); //does not increase ROMindex
                break;
            case "A-command":
                ROMindex++;
                break;
            case "C-command": 
                ROMindex++;
                break;
        }
    });

    //do second pass
    ASMinput.forEach(function(ASMline,pos) {
        switch( getCommandType(ASMline) ) {
            case "A-command":
                processACommand(ASMline);
                break;
            case "C-command": 
                processCCommand(ASMline);
                break;
        }
    });

    //return binary output
    var text = binaryOutput.join("\n");

    if ( !text || text.indexOf("undefined") >= 0 ) {
        alert("Compilation error occurred.");
    }
    return text;
}
