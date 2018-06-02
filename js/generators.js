function fire(gen, max = 10) {
  // get the generator read
  let mine = gen();
  // get a yielded value
  let yielded = mine.next();
  for (let i = 0; i <= max; i++) {
    // if uncomplete go to the next yield with what was previously yielded
    if (yielded.done === false) {
      // console.log("y:", yielded, "i:", i, yielded.value === i);
      yielded = mine.next(yielded.value);
    } else {
      //  otherwise say we're done
      console.log("Done:", yielded.done);
      break;
    }
  };
  console.log("Your generator was fired");
}
