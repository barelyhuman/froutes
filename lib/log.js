import colors from 'kleur'

const {reset} = colors

export const bullet = colors.bold().white
export const info = colors.bold().blue
export const warning = colors.bold().yellow
export const error = colors.bold().red
export const {dim} = colors.reset()

export const log = {
	info: (m) => console.log(info('[froutes] '), reset(bullet(m))),
	warning: (m) => console.warn(info('[froutes] '), reset(warning(m))),
	error: (m) => console.error(info('[froutes] '), reset(error(m))),
}
