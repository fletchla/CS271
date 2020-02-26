// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.
	@8192 // # of RAM registers between SCREEN and KBD
	D=A //stow 8192 in D
	@RAMROWS //variable to store how many times to loop through
	M=D //start with 8192 for how many times to loop
(RESTART)
	@index //variable to count up to RAMROWS
	M=0 //initialize to 0
(MAIN)
	@KBD //get input from keyboard
	D=M //stow value in D
	@BLACK
	D;JNE //if not zero, go to BLACK loop. otherwise, continue into WHITE loop
(WHITE)
	@index
	D=M //stow current value of index in D
	@SCREEN
	A=A+D //uses index to count up from first SCREEN register
	M=0 //paint the screen white (default) but ensure all of it is white
	@END
	0;JMP //don't proceed through the black loop
(BLACK)
	@index
	D=M //stow current value of index in D
	@SCREEN
	A=A+D
	M=-1 //-1 in 2's complement produces all 1's
(END)
	@index
	MD=M+1 //both M=M+1 and D=M+1. adding 1 to index to count up to 8192
	@RAMROWS
	D=D-M //check if it's gone through all RAMROWS yet
	@RESTART
	D;JEQ //if this is 0, the entire screen has been painted white or black. Restart to check for new input
	@MAIN
	0;JMP //always go back through the main loop if the whole screen isn't filled yet