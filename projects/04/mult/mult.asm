// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.
	//takes RAM[0] and adds it to itself in RAM[2] RAM[1] times
	@2 //RAM[2] is answer register
	M=0 //initialize to 0
(LOOP)
	@1
	D=M
	@END
	D;JEQ
	@0
	D=M
	@2 //in RAM[2]
	M=M+D //add RAM[0] to the answer
	@1
	M=M-1
	@LOOP
	0;JMP
(END)
	@END
	0;JMP
	