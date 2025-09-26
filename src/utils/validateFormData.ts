type FormDataFields = {
    type: string;
    name: string;
    serialNumber: string;
    imeiNumber: string;
    shopName: string;
    purchaseLocation: string;
    missingDate: string;
    missingLocation: string;
    purchasedCondition: string;
    currentCondition: string;
    description: string;
    thumbnail: string;
    receipt: string;
  };
  
  const validTypes = ['Mobilephone', 'Car', 'Laptop', 'OtherElectronics'];
  const validConditions = ['lost', 'stolen', 'safe'];
  
  export function validateFormData(data: Partial<FormDataFields>) {
    const errors: string[] = [];
  
    if (!validTypes.includes(data.type || '')) {
      errors.push(`type must be one of: ${validTypes.join(', ')}`);
    }
  
    for (const field of [
      'name',
      'serialNumber',
      'imeiNumber',
      'shopName',
      'purchaseLocation',
      'missingDate',
      'missingLocation',
      'description',
      'thumbnail',
      'receipt',
    ]) {
      if (!data[field as keyof FormDataFields]) {
        errors.push(`${field} is required`);
      }
    }
  
    if (!validConditions.includes(data.purchasedCondition || '')) {
      errors.push(`purchasedCondition must be one of: ${validConditions.join(', ')}`);
    }
  
    if (!validConditions.includes(data.currentCondition || '')) {
      errors.push(`currentCondition must be one of: ${validConditions.join(', ')}`);
    }
  
    return errors;
  }
  