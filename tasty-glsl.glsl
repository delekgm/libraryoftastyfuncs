// Random
float random(vec2 p) { 
    vec2 K1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant) 
    2.665144142690225 // 2^sqrt(2) (GelfondSchneider constant) 
    ); 
    return fract(cos(dot(p,K1)) * 12345.6789); 
}

// Rotate 2d
vec2 rotate2D(vec2 v, float angle) {
	float s = sin(angle);
	float c = cos(angle);
	mat2 m = mat2(c, s, -s, c);
	return m * v;
}

// Lines
float lines(vec2 uv, float freq, float offset) {
	return smoothstep(
		0., .5 + offset * .5,
		abs(.5*(sin(uv.x * freq) + offset*2.))
	);
}

// Basic Noise Function
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WARNING: This file was auto-generated, any change will be overridden in next release. Please use configs/es6.conf.js then run "npm run convert". //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Based on Nvidia Cg tutorial
 */
var FresnelShader = {

	uniforms: {

		"mRefractionRatio": { value: 1.02 },
		"mFresnelBias": { value: 0.1 },
		"mFresnelPower": { value: 2.0 },
		"mFresnelScale": { value: 1.0 },
		"tCube": { value: null }

	},

	vertexShader: [

		"uniform float mRefractionRatio;",
		"uniform float mFresnelBias;",
		"uniform float mFresnelScale;",
		"uniform float mFresnelPower;",

		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",

		"void main() {",

		"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
		"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

		"	vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

		"	vec3 I = worldPosition.xyz - cameraPosition;",

		"	vReflect = reflect( I, worldNormal );",
		"	vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );",
		"	vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );",
		"	vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );",
		"	vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );",

		"	gl_Position = projectionMatrix * mvPosition;",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform samplerCube tCube;",

		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",

		"void main() {",

		"	vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
		"	vec4 refractedColor = vec4( 1.0 );",

		"	refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
		"	refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
		"	refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",

		"	gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

		"}"

	].join( "\n" )

};

export { FresnelShader }