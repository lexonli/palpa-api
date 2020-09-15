export function getFaunaError(error) {
  try {
    const { errors } = error.requestResult.responseContent;
    if (errors) {
      return errors[0].code;
    }
    return undefined;
  } catch (err) {
    return undefined;
  }
}

export function handleNotFoundError(error, res, message) {
  if (getFaunaError(error) === 'instance not found') {
    res.status(400).json({
      errors: [{ message }],
    });
  } else {
    res.status(500).json({
      errors: [{ message: error.toString() }],
    });
  }
}
