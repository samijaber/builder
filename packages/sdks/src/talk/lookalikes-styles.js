// react
<div onClick={() => trackClick(props.content.id)} />

// vue
<div @click="trackClick(content.id)" />

// svelte
<div on:click={() => trackClick(content.id)} />

// solidjs
<div onClick={() => trackClick(props.content.id)} />

// qwik
<div onClick$={() => trackClick(props.content.id)} />