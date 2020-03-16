jQuery(function($) {
    // Main program goes here
    if(!window.FileReader) {
        alert("Your browser does not support FileReader, please use quick test.");
        return;
    }

    var fileInput = new StringFromFileInput();
    var $submitButton = jQuery("#submitButton");
    var $quickTestButton = jQuery("#quickTestButton");
    var $outputText = jQuery("#outputText");

    // When clicking submit, get text from the file selected, run assembler
    $submitButton.on( "click", function() {
        var fileText = fileInput.getValue();

        if ( fileText ) {
            var binaryOutput = hackAssembler( fileText );
            $outputText.val(binaryOutput);

        }else{
            alert("Check your input file and try again");
        }

        return false;
    });

    // Clicking "Use Example" (Quick test button) does not need a file
    // Pre-loaded file will be used instead
    $quickTestButton.on( "click", function() {
        var fileText = getSampleFileString();
        var binaryOutput = hackAssembler( fileText );
        $outputText.val(binaryOutput);

        return false;
    });
});

// Functions go here
function StringFromFileInput() {
    var ThisParent = this;
    this.reader = new FileReader();
    this.fileInputText = "";
    this.inputFile = jQuery("#inputFile");

    // When a file is selected, open with reader
    this.inputFile.on('change', function(e) {
        ThisParent.reader.readAsText( e.target.files[0] );
    });

    // When file is read by reader, save string to fileInputText
    this.reader.onload = function(e) {
        if (e.target.readyState != 2) return;
        if (e.target.error) return;
        ThisParent.fileInputText = e.target.result;
    };

    // Get value last read by reader
    this.getValue = function() {
        return ThisParent.fileInputText;
    }
}

function getSampleFileString() {
    /*
    text is from:
    mult.asm
    
    output should be:
    0000000000000010
    1110101010001000
    0000000000000001
    1111110000010000
    0000000000001110
    1110001100000010
    0000000000000000
    1111110000010000
    0000000000000010
    1111000010001000
    0000000000000001
    1111110010001000
    0000000000000010
    1110101010000111
    0000000000001110
    1110101010000111
    */

    return "// This file is part of www.nand2tetris.org" + "\n" +
    "// and the book \"The Elements of Computing Systems\"" + "\n" +
    "// by Nisan and Schocken, MIT Press." + "\n" +
    "// File name: projects/04/Mult.asm" + "\n" +
    "" + "\n" +
    "// Multiplies R0 and R1 and stores the result in R2." + "\n" +
    "// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)" + "\n" +
    "" + "\n" +
    "// Put your code here." + "\n" +
    "    //takes RAM[0] and adds it to itself in RAM[2] RAM[1] times" + "\n" +
    "    @2 //RAM[2] is answer register" + "\n" +
    "    M=0 //initialize to 0" + "\n" +
    "(LOOP)" + "\n" +
    "    @1" + "\n" +
    "    D=M" + "\n" +
    "    @END" + "\n" +
    "    D;JEQ" + "\n" +
    "    @0" + "\n" +
    "    D=M" + "\n" +
    "    @2 //in RAM[2]" + "\n" +
    "    M=M+D //add RAM[0] to the answer" + "\n" +
    "    @1" + "\n" +
    "    M=M-1" + "\n" +
    "    @LOOP" + "\n" +
    "    0;JMP" + "\n" +
    "(END)" + "\n" +
    "    @END" + "\n" +
    "    0;JMP";
}