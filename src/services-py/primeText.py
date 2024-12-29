import math
from primeUtils import *
from prime import *

PRIME_OUTPUT_FOLDER = "output-big"


def generate_primes(number):
    return generate_primes_up_to(number)


def check_divisor_not_exist_on_text_files(number, sqrt_number, current=2):
    """
    Checks if a number is divisible by any prime up to its square root using updated text file logic.

    :param number: The number to check.
    :param sqrt_number: The square root of the number.
    :param current: The current candidate divisor.
    :return: A message indicating if the number is prime or not.
    """
    while current <= sqrt_number:
        if is_prime_from_text_files(current):
            print("current prime:", current)
            if number % current == 0:
                return f"{number} is divisible by {current}.\n{number} is not prime."
        current = find_next_candidate(current)
    return f"{number} is a prime number."


def is_prime_from_text_files(num, source=folder_path):
    """
    Determines if a number is prime using prime data stored in text files.

    :param num: The number to check.
    :param source: Path to the directory containing prime data.
    :return: A message indicating if the number is prime or not.
    """
    sqrt_num = int(num**0.5)
    folder = get_proper_prime_folder(sqrt_num)

    if folder and "larger than" not in folder:
        if check_divisor_from_files(num, folder):
            return f"{num} is not a prime number."
        return f"{num} is not divisible by any prime up to floor sqrt root of it ({sqrt_num}).\n{num} is a prime number."

    last_folder_path = get_last_prime_folder()
    if check_divisor_from_files(num, last_folder_path):
        return f"{num} is not a prime number."

    last_number = int(last_folder_path.replace(f"{source}/", "").replace("output-", ""))
    return check_divisor_not_exist_on_text_files(
        num, sqrt_num, find_next_candidate(last_number)
    )


def generate_primes_files(num):
    """
    Generates prime files up to a given number, updating existing folders or creating new ones.

    :param num: The upper limit of primes to generate.
    """
    if num_folder_exist(num):
        return
    generate_from_existing_folders_result = generate_prime_output_from_text(num)
    if "is greater than largest output" not in generate_from_existing_folders_result:
        return
    copy_files_and_format_last_file(num)


def get_all_divisors(number):
    """
    Finds all divisors of a given number using prime factorization.

    :param number: The number to find divisors for.
    :return: A sorted list of all divisors of the number.
    """
    if number <= 1:
        return [1]

    original_number = number
    divisors = [1]
    sqrt_number = int(number**0.5)
    current = 2

    while current <= sqrt_number:
        if number % current == 0:
            print(f"divisor: {current}")
            divisors.append(current)
            number //= current
            sqrt_number = int(number**0.5)  # Update sqrt for reduced number
        else:
            current = find_next_candidate(current)

    if (
        number > 1 and number != original_number
    ):  # If there's a remaining prime factor larger than sqrt
        divisors.append(number)

    divisors.append(original_number)  # Include the number itself
    return sorted(divisors)
