<script setup lang="ts">
import type { Spec } from 'comment-parser';
import { isDefaultType } from '../utils/isDefaultType';

const props = defineProps<{
  apiParameters: Spec[];
  hook: string;
}>();

type Group = {
  id: number;
  parameters: Spec[];
  returns: Spec | null;
};

let groupIndex = 0;
const groups: Group[] = [{ id: groupIndex, parameters: [], returns: null }];

props.apiParameters.forEach((parameter, index) => {
  if (parameter.tag === 'overload') {
    const isFirstOverload =
      props.apiParameters.findIndex((parameter) => parameter.tag === 'overload') === index;
    if (!isFirstOverload) {
      groupIndex++;
      groups.push({ id: groupIndex, parameters: [], returns: null });
    }
    return;
  }

  if (parameter.tag === 'returns') {
    groups[groupIndex].returns = parameter;
    return;
  }

  groups[groupIndex].parameters.push(parameter);
});

const baseUrl = `https://github.com/siberiacancode/reactuse/blob/main/src/hooks/${props.hook}/${props.hook}.ts`

function getSourceLink(returns: Spec) {
  // TODO: start-end line
  return `${baseUrl}#L${returns.source[0].number}`;
}
</script>

<template>
  <div v-for="group in groups" :key="group.id">
    <h3 v-if="group.parameters.length">Parameters</h3>
    <table v-if="group.parameters.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="parameter in group.parameters" :key="parameter.name">
          <td>{{ parameter.name }}{{ parameter.optional ? '?' : '' }}</td>

          <td v-if="isDefaultType(parameter.type)">
            {{ parameter.type }}
          </td>
          <td v-else>
            <!-- TODO: getSourceLink -->
            <a href="#">{{ parameter.type }}</a>
          </td>

          <td>
            {{ parameter.default ?? '-' }}
          </td>
          <td>{{ parameter.description }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="group.returns">
      <h3>Returns</h3>
      <p v-if="isDefaultType(group.returns.type)">
        <code>{{ group.returns.type }}</code>
      </p>
      <p v-else>
        <a :href="getSourceLink(group.returns)" target="_blank">
          <code>{{ group.returns.type }}</code>
        </a>
      </p>
    </div>
  </div>
</template>
