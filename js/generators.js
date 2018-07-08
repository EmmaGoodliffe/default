function smarts (theGen, max = 8) {
	const gen = theGen();
  let got = gen.next();
  let n = 0;
  while (!got.done) {
  	
    got = gen.next(got.value);
  	if (n > max) {
    console.log("The emergency breaks were engaged.");
    break;
    }
    n++;
  }
  
}
