/**
 * Converts a number string to a slot-based object.
 * Each digit is mapped to its position in reverse order.
 * @param {string} num - The number string to convert.
 * @returns {Object} - An object where keys are positions and values are digits.
 */
const numberToSlots = (num) => {
  if (typeof num !== "string") {
    return "Input should be a string.";
  }
  const result = {};
  for (let i = 0; i < num.length; i++) {
    result[num.length - i - 1] = num[i];
  }
  return result;
};



/**
 * Calculates the sum of digits in a number string.
 * @param {string} num - The number string.
 * @returns {number} - Sum of the digits.
 */
const calculateDigitSum = (num) => {
  if (typeof num !== "string") {
    return "Input should be a string.";
  }
  return [...num].reduce((sum, digit) => sum + +digit, 0);
};

/**
 * Checks if a number string is divisible by 2.
 * @param {string} num - The number string.
 * @returns {boolean} - True if divisible by 2, otherwise false.
 */
const isDivisibleBy2 = (num) => {
  if (typeof num !== "string") {
    return "Input should be a string.";
  }
  return +num[num.length - 1] % 2 === 0;
};

/**
 * Checks if a number string is divisible by 3.
 * @param {string} num - The number string.
 * @returns {boolean} - True if divisible by 3, otherwise false.
 */
const isDivisibleBy3 = (num) => {
  if (typeof num !== "string") {
    return "Input should be a string.";
  }
  return calculateDigitSum(num) % 3 === 0;
};

/**
 * Checks if a number string is divisible by 5.
 * @param {string} num - The number string.
 * @returns {boolean} - True if divisible by 5, otherwise false.
 */
const isDivisibleBy5 = (num) => {
  if (typeof num !== "string") {
    return "Input should be a string.";
  }
  const lastDigit = num[num.length - 1];
  return lastDigit === "0" || lastDigit === "5";
};

/**
 * Checks if a number string is divisible by 6.
 * @param {string} num - The number string.
 * @returns {boolean} - True if divisible by 6, otherwise false.
 */
const isDivisibleBy6 = (num) => {
  if (typeof num !== "string") {
    return "Input should be a string.";
  }
  return isDivisibleBy2(num) && isDivisibleBy3(num);
};

/**
 * Finds the maximum of two number strings.
 * @param {string} num1 - First number string.
 * @param {string} num2 - Second number string.
 * @returns {string} - The larger of the two numbers.
 */
const findMax = (num1, num2) => {
  if (typeof num1 !== "string" || typeof num2 !== "string") {
    return "Inputs should be strings.";
  }
  if (num1.length !== num2.length) {
    return num1.length > num2.length ? num1 : num2;
  }
  return num1 > num2 ? num1 : num2;
};

/**
 * Finds the minimum of two number strings.
 * @param {string} num1 - First number string.
 * @param {string} num2 - Second number string.
 * @returns {string} - The smaller of the two numbers.
 */
const findMin = (num1, num2) => {
  return findMax(num1, num2) === num1 ? num2 : num1;
};

/**
 * Adds two number strings.
 * @param {string} num1 - First number string.
 * @param {string} num2 - Second number string.
 * @returns {string} - The sum as a string.
 */
const addNumbers = (num1, num2) => {
  if (typeof num1 !== "string" || typeof num2 !== "string") {
    return "Inputs should be strings.";
  }
  const slots1 = numberToSlots(num1);
  const slots2 = numberToSlots(num2);

  let carry = 0;
  let result = "";
  const maxLength = Math.max(
    Object.keys(slots1).length,
    Object.keys(slots2).length
  );

  for (let i = 0; i < maxLength; i++) {
    const sum = +(slots1[i] || 0) + +(slots2[i] || 0) + carry;
    result = (sum % 10) + result;
    carry = Math.floor(sum / 10);
  }
  if (carry) result = carry + result;
  return result;
};

/**
 * Subtracts one number string from another.
 * @param {string} num1 - First number string (minuend).
 * @param {string} num2 - Second number string (subtrahend).
 * @returns {string} - The difference as a string.
 */
const subtractNumbers = (num1, num2) => {
  if (typeof num1 !== "string" || typeof num2 !== "string") {
    return "Inputs should be strings.";
  }
  if (num1 === num2) return "0";

  const isNegative = findMax(num1, num2) === num2;
  if (isNegative) [num1, num2] = [num2, num1];

  const slots1 = numberToSlots(num1);
  const slots2 = numberToSlots(num2);

  let result = "";
  let borrow = 0;

  for (let i = 0; i < num1.length; i++) {
    let diff = +(slots1[i] || 0) - +(slots2[i] || 0) - borrow;
    if (diff < 0) {
      diff += 10;
      borrow = 1;
    } else {
      borrow = 0;
    }
    result = diff + result;
  }
  return (isNegative ? "-" : "") + result.replace(/^0+/, "");
};

/**
 * Multiplies a number string by a single digit.
 * @param {string} num - The number string.
 * @param {string} digit - The single digit as a string.
 * @returns {string} - The product as a string.
 */
const multiplyByDigit = (num, digit) => {
  if (typeof num !== "string" || typeof digit !== "string") {
    return "Inputs should be strings.";
  }
  let carry = 0;
  let result = "";

  for (let i = num.length - 1; i >= 0; i--) {
    const product = +num[i] * +digit + carry;
    result = (product % 10) + result;
    carry = Math.floor(product / 10);
  }
  if (carry) result = carry + result;
  return result;
};

/**
 * Multiplies two number strings.
 * @param {string} num1 - First number string.
 * @param {string} num2 - Second number string.
 * @returns {string} - The product as a string.
 */
const multiplyNumbers = (num1, num2) => {
  if (typeof num1 !== "string" || typeof num2 !== "string") {
    return "Inputs should be strings.";
  }
  let result = "0";

  for (let i = num2.length - 1; i >= 0; i--) {
    const product =
      multiplyByDigit(num1, num2[i]) + "0".repeat(num2.length - 1 - i);
    result = addNumbers(result, product);
  }
  return result;
};

/**
 * Divides two number strings and returns the quotient and remainder.
 * @param {string} num1 - Dividend.
 * @param {string} num2 - Divisor.
 * @returns {[string, string]} - Quotient and remainder as strings.
 */
const divideNumbers = (num1, num2) => {
  if (typeof num1 !== "string" || typeof num2 !== "string") {
    return "Inputs should be strings.";
  }
  if (num2 === "0") return "Division by zero is undefined.";

  let quotient = "";
  let remainder = "0";

  for (let i = 0; i < num1.length; i++) {
    remainder = addNumbers(multiplyByDigit(remainder, "10"), num1[i]);
    let count = 0;

    while (findMax(remainder, num2) === remainder) {
      remainder = subtractNumbers(remainder, num2);
      count++;
    }
    quotient += count;
  }
  return [quotient.replace(/^0+/, "") || "0", remainder];
};

/**
 * Calculates the floor of the square root of a number string.
 * @param {string} num - The number string.
 * @returns {string} - The floor of the square root.
 */
const sqrtFloor = (num) => {
  if (typeof num !== "string") {
    return "Input should be a string.";
  }

  let low = "0";
  let high = num;
  let ans = "0";

  while (findMax(low, high) !== low || low === high) {
    const mid = divideNumbers(addNumbers(low, high), "2")[0];
    const square = multiplyNumbers(mid, mid);

    if (findMax(square, num) === num || square === num) {
      ans = mid;
      low = addNumbers(mid, "1");
    } else {
      high = subtractNumbers(mid, "1");
    }
  }
  return ans;
};

/**
 * Computes the power of a number string to an exponent.
 * @param {string} num - The base as a string.
 * @param {string} exp - The exponent as a string.
 * @returns {string} - The result as a string.
 */
const power = (num, exp) => {
  if (typeof num !== "string" || typeof exp !== "string") {
    return "Inputs should be strings.";
  }
  if (num === "0" && exp !== "0") return "0"
  if (num === "0" && exp === "0") return "Not defined."
  if (num === "1" || exp === "0") return "1"
  let result = num;
  while (findMax(exp, "1") !== "1") {
    result = multiplyNumbers(result, num);
    exp = subtractNumbers(exp, "1");
  }
  return result;
};

export {
  numberToSlots,
  calculateDigitSum,
  isDivisibleBy2,
  isDivisibleBy3,
  isDivisibleBy5,
  isDivisibleBy6,
  findMax,
  findMin,
  addNumbers,
  subtractNumbers,
  multiplyByDigit,
  multiplyNumbers,
  divideNumbers,
  sqrtFloor,
  power,
};
