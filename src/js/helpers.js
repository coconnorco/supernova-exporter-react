/**
 * Convert group name, token name and possible prefix into camelCased string, joining everything together
 */
Pulsar.registerFunction(
  "readableVariableName",
  function (token, tokenGroup, prefix) {
    // Create array with all path segments and token name at the end
    const segments = [...tokenGroup.path];
    if (!tokenGroup.isRoot) {
      segments.push(tokenGroup.name)
    }
    segments.push(token.name);

    if (prefix && prefix.length > 0) {
      segments.unshift(prefix);
    }

    // Create "sentence" separated by spaces so we can camelcase it all
    let sentence = segments.join(" ");

    // Return camelcased string from all segments
     sentence = sentence
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

    // only allow letters, digits, underscore
    sentence = sentence.replace(/[^a-zA-Z0-9_]/g, '_')

    // prepend underscore if it starts with digit 
    if (/^\d/.test(sentence)) {
      sentence = '_' + sentence;
    }
    
    return sentence;
  }
);

/**
 * Behavior configuration of the exporter
 * Prefixes: Add prefix for each category of the tokens. For example, all colors can start with "color, if needed"
 */
const BEHAVIOR = {
  color: {
    fileName: "colors", // this should be somehow synced with output.json contents
    varName: "colors",
    themeProperty: "colors",
    tokenPrefix: "",
    isInternal: false,
  },
  border: {
    fileName: "borders", // this should be somehow synced with output.json contents
    varName: "borders",
    themeProperty: "borders",
    tokenPrefix: "",
    isInternal: false,
  },
  gradient: {
    fileName: "gradients", // this should be somehow synced with output.json contents
    varName: "gradients",
    themeProperty: "gradients",
    tokenPrefix: "",
    isInternal: false,
  },
  measure: {
    fileName: "measures", // this should be somehow synced with output.json contents
    varName: "measures",
    themeProperty: "measures",
    tokenPrefix: "",
    isInternal: false,
  },

  shadow: {
    fileName: "shadows", // this should be somehow synced with output.json contents
    varName: "shadows",
    themeProperty: "shadows",
    tokenPrefix: "",
    isInternal: false,
  },
  typography: {
    fileName: "typography", // this should be somehow synced with output.json contents
    varName: "typography",
    themeProperty: "typography",
    tokenPrefix: "",
    isInternal: true,
  },
  radius: {
    fileName: "radii", // this should be somehow synced with output.json contents
    varName: "raddii",
    themeProperty: "radii",
    tokenPrefix: "",
    isInternal: false,
  },
  unknown: {
    fileName: "uknown",
    varName: "unknowns",
    themeProperty: "unknowns",
    tokenPrefix: "",
    isInternal: false,
    unknown: true
  }
};

function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
      return '[Circular]';

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;
  }
}

Pulsar.registerFunction("getPublicTokens", function (tokens) {
  return tokens.filter(t => t.propertyValues.isInternal !== true);
});

Pulsar.registerFunction("getPublicBehaviors", function () {
  return Object.entries(BEHAVIOR).filter(([_, v]) => !v.isInternal && !v.unknown).map(([k]) => k);
});

Pulsar.registerFunction("getInternalBehaviors", function () {
  return Object.entries(BEHAVIOR).filter(([_, v]) => v.isInternal  && !v.unknown).map(([k]) => k);
});

Pulsar.registerFunction("toJSON", function (obj) {
  return JSON.stringify(obj, censor(obj));
});

Pulsar.registerFunction("getBehavior", function (tokenType) {
  return BEHAVIOR[tokenType.toLowerCase()] || BEHAVIOR['unknown'];
});

Pulsar.registerFunction("buildReferenceMeta", function(tokenType, tokenValue){
  return {
    tokenType,
    referencedToken: tokenValue.referencedToken
  }
})