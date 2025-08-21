export const getNicDetails = (nicNumber: string) => {
  let valid = false;
  let dayText = 0;
  let year = '';
  let month = '';
  let day = 0;
  let gender = '';

  if (nicNumber.length === 10 && nicNumber.toUpperCase().endsWith('V')) {
    valid = true;
    // Old format with 'V'
    year = '19' + nicNumber.substring(0, 2);
    dayText = parseInt(nicNumber.substring(2, 5));
  } else if (nicNumber.length === 12) {
    valid = true;
    // New format with 12 digits
    year = nicNumber.substring(0, 4);
    dayText = parseInt(nicNumber.substring(4, 7));
  }

  // Gender
  if (dayText > 500) {
    gender = 'Female';
    dayText -= 500;
  } else {
    gender = 'Male';
  }

  // Day Digit Validation
  if (dayText > 1 && dayText <= 366) {
    if (dayText > 335) {
      day = dayText - 335;
      month = 'Dec';
    } else if (dayText > 305) {
      day = dayText - 305;
      month = 'Nov';
    } else if (dayText > 274) {
      day = dayText - 274;
      month = 'Oct';
    } else if (dayText > 244) {
      day = dayText - 244;
      month = 'Sep';
    } else if (dayText > 213) {
      day = dayText - 213;
      month = 'Aug';
    } else if (dayText > 182) {
      day = dayText - 182;
      month = 'Jul';
    } else if (dayText > 152) {
      day = dayText - 152;
      month = 'Jun';
    } else if (dayText > 121) {
      day = dayText - 121;
      month = 'May';
    } else if (dayText > 91) {
      day = dayText - 91;
      month = 'Apr';
    } else if (dayText > 60) {
      day = dayText - 60;
      month = 'Mar';
    } else if (dayText < 32) {
      month = 'Jan';
      day = dayText;
    } else if (dayText > 31) {
      day = dayText - 31;
      month = 'Feb';
    }
  }
  const dob = `${year}-${month}-${day}`;
  return {
    isValid: valid,
    dob: valid ? dob : null,
    gender: valid ? gender : null,
  };
};
