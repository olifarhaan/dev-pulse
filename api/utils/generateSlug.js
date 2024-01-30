import slugify from "slugify"

const generateSlug = (title) => {
  return slugify(title, {
    replacement: "-",
    lower: true, // Convert to lowercase
    strict: true,
    remove: /[*+~.()&^%#;?<>='"!:@]/g,
  })
}

export default generateSlug
