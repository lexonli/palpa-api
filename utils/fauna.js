function getFaunaError(error) {
  try {
    const { errors } = error.requestResult.responseContent;
    if (errors) {
      return errors[0];
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
}

export default getFaunaError;
