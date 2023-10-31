#!/bin/bash

cd ./wikidata-create
npm run build
npm run start -- \
  --w $1    \
  --n $2    \
  --e $3    \
  --s $4    \
  --rows 2  \
  --cols 2  \
  --conn $5
  # --cats \
  #   Q3914       ${IFS# school } \
  #   Q3918       ${IFS# university } \
  #   Q7075       ${IFS# library } \
  #   Q11707      ${IFS# restaurant } \
  #   Q16917      ${IFS# hospital } \
  #   Q23397      ${IFS# lake } \
  #   Q23413      ${IFS# castle } \
  #   Q27686      ${IFS# hotel } \
  #   Q31855      ${IFS# research institute } \
  #   Q33506      ${IFS# museum } \
  #   Q38723      ${IFS# higher education institution } \
  #   Q41176      ${IFS# building } \
  #   Q57821      ${IFS# fortification } \
  #   Q83405      ${IFS# factory } \
  #   Q130003     ${IFS# ski resort } \
  #   Q131734     ${IFS# brewery } \
  #   Q179700     ${IFS# statue } \
  #   Q210272     ${IFS# cultural heritage } \
  #   Q216107     ${IFS# department store } \
  #   Q655686     ${IFS# commercial building } \
  #   Q811979     ${IFS# architectural structure } \
  #   Q814610     ${IFS# emergency service } \
  #   Q838948     ${IFS# work of art } \
  #   Q839954     ${IFS# archaeological site } \
  #   Q860861     ${IFS# sculpture } \
  #   Q960648     ${IFS# point of interest } \
  #   Q1007870    ${IFS# art gallery } \
  #   Q1664720    ${IFS# institute } \
  #   Q2385804    ${IFS# educational institution } \
  #   Q3152824    ${IFS# cultural institution } \
  #   Q4260475    ${IFS# medical facility } \
  #   Q4287745    ${IFS# medical organization } \
  #   Q4671277    ${IFS# academic institution } \
  #   Q4989906    ${IFS# monument } \
  #   Q10855061   ${IFS# archaeological find } \
  #   Q12819564   ${IFS# station } \
  #   Q13409250   ${IFS# aerial lift } \
  #   Q15621286   ${IFS# intellectual work } \
  #   Q16519632   ${IFS# scientific organization } \
  #   Q16668826   ${IFS# stationery shop } \
  #   Q23056934   ${IFS# church } \
  #   Q24398318   ${IFS# religious building } \
  #   Q30139652   ${IFS# health care structure } \
  #   Q48835818   ${IFS# accommodation facility } \
  #   Q63099748   ${IFS# hotel building } \
  #   Q108935461  ${IFS# research institution } \
  #   Q110910970  ${IFS# visual work }

# Q43229 organization
# Q386724 work
# Q17537576 creative work
