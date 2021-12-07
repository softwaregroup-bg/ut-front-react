# Text

props:

    params
    prefix

property params: if there is a text for instance "Lazy ${animal} jumped over .."
and in params there is a property "animal" whit value "fox" the text will be
transformed to "Lazy fox jumped over .. (params control simple template
like functionality)

property prefix: is used for narrowing search in text dictionary. For instance,
if we have prefix='abc' and text in Text component "letters", Text component
will try to translate "abcletters" and if there is translation will return it,
if there is no translation "letters" text will be returned
